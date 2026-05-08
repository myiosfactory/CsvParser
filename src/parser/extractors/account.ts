import { AccountInfo, SectionMap } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { kvMap, lookup } from "./helpers.js";
import { SEC } from "./constants.js";

export function extractAccount(sections: SectionMap): AccountInfo {
  const kv = kvMap(findSection(sections, ...SEC.account));
  return {
    name: lookup(kv, "name"),
    accountId: lookup(kv, "Account", "Konto"),
    baseCurrency: lookup(kv, "Base currency", "Basiswährung"),
    type: lookup(kv, "Account type", "Kontotyp"),
    customerType: lookup(kv, "Customer type", "Kundentyp"),
    permissions: lookup(kv, "Account permissions", "Kontoberechtigungen"),
    masterName: lookup(kv, "Master Name", "Master-Name"),
  };
}
