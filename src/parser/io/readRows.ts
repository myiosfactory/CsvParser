import * as XLSX from "xlsx";

export function readRows(input: string | Buffer, filename?: string): string[][] {
  const isXlsx = looksLikeXlsx(input, filename);
  const wb = isXlsx
    ? XLSX.read(input, { type: typeof input === "string" ? "string" : "buffer" })
    : XLSX.read(typeof input === "string" ? input : input.toString("utf-8"), {
        type: "string",
        raw: true,
      });

  const out: string[][] = [];
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });
    for (const r of rows) {
      out.push(r.map((c) => (c === null || c === undefined ? "" : String(c))));
    }
  }
  return out;
}

function looksLikeXlsx(input: string | Buffer, filename?: string): boolean {
  if (filename && /\.xlsx$/i.test(filename)) return true;
  if (Buffer.isBuffer(input) && input.length >= 4) {
    // XLSX is a ZIP, magic bytes "PK\x03\x04"
    if (input[0] === 0x50 && input[1] === 0x4b && input[2] === 0x03 && input[3] === 0x04) {
      return true;
    }
  }
  return false;
}
