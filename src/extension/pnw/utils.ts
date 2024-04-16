import { Period, SymbolInfo } from "../../types";

export function getCurrentSymbolPeriod(): {symbol: SymbolInfo, period: Period} {
  const chart = globalThis.kchartInstance;

  return { symbol: chart.getSymbol(), period: chart.getPeriod() };
}

export const continentFromAcro = {
  'global': 'global',
  'na': 'north_america',
  'sa': 'south_america',
  'eu': 'europe',
  'af': 'africa',
  'as': 'asia',
  'au': 'australia'
}