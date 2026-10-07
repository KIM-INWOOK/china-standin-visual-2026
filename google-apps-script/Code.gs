const SHEET_ID = '1t22eABZIATqXHgW83bn3Z2QT42T-Dy5s0Gi0njYMnFM';
const TAB_NAME = '독자의견';
const HEADERS = ['id', '대신해줬으면 하는 일', '금액(원)', '작성시간', '공개여부'];

function output(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
    if (!sheet || sheet.getLastRow() < 2) return output({opinions: []});
    const rows = sheet.getRange(Math.max(2, sheet.getLastRow()-499), 1,
      Math.min(500, sheet.getLastRow()-1), 5).getValues();
    const opinions = rows.filter(r => r[4] === '공개').reverse().slice(0, 100)
      .map(r => ({id: String(r[0]), task: String(r[1]).replace(/^'(?=[=+@-])/, ''),
        price: Number(r[2]), created_at: new Date(r[3]).getTime()}));
    return output({opinions});
  } catch (err) { return output({error: '의견을 불러오지 못했습니다.'}); }
}
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || e.postData.contents.length > 4096)
      return output({error: '입력 내용을 확인해주세요.'});
    const data = JSON.parse(e.postData.contents);
    const task = typeof data.task === 'string' ? data.task.trim() : '';
    const price = data.price;
    if (!task || task.length > 300 || !Number.isInteger(price) ||
        price < 0 || price > 1000000000 || data.website)
      return output({error: '내용과 금액을 확인해주세요.'});
    lock.waitLock(10000);
    const book = SpreadsheetApp.openById(SHEET_ID);
    let sheet = book.getSheetByName(TAB_NAME);
    if (!sheet) sheet = book.insertSheet(TAB_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS); sheet.setFrozenRows(1);
    }
    if (JSON.stringify(sheet.getRange(1,1,1,5).getValues()[0]) !== JSON.stringify(HEADERS))
      return output({error: '저장 시트의 열 구성을 확인해주세요.'});
    const now = Date.now();
    const key = Utilities.base64EncodeWebSafe(Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, task + ':' + price));
    const cache = CacheService.getScriptCache();
    if (cache.get(key)) return output({error: '같은 의견은 잠시 후 다시 남겨주세요.'});
    const opinion = {id: Utilities.getUuid(), task, price, created_at: now};
    const safeTask = /^[=+@-]/.test(task) ? "'" + task : task;
    sheet.appendRow([opinion.id, safeTask, price, new Date(now), '공개']);
    SpreadsheetApp.flush(); cache.put(key, '1', 60);
    return output({opinion});
  } catch (err) { return output({error: '의견을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.'}); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}
