import { Figure, Indicator, IndicatorFigure, IndicatorSeries, IndicatorTemplate, KLineData } from "klinecharts";
import { continentFromAcro, getCurrentSymbolPeriod } from "./utils";


function generateFigures([continentStr]: string[]): IndicatorFigure[] {
  const continets: string[] = continentStr.split(',').map((str: string) => str.trim());
  return [ 'global', ...continets ].map((v, i, j) => {
    const key = continentFromAcro[v as keyof typeof continentFromAcro]
    const title = `${v.toUpperCase()}: `
    return { key, title, type: 'line', baseValue: 0 }
  })
}

const radiation: IndicatorTemplate = {
  name: "RAD",
  shortName: "RAD",
  series: IndicatorSeries.Normal,
  calcParams: ["na,sa,eu,af,as,au"],
  shouldFormatBigNumber: false,
  precision: 2,
  figures: generateFigures(["na,sa,eu,af,as,au"]),
  regenerateFigures: generateFigures,
  calc: async (dataList: KLineData[], indicator: Indicator) => {
    const { period } = getCurrentSymbolPeriod()
    const [from, to]: any[] = [dataList.at(0), dataList.at(-1)]

    const url = 
      `/radiation/range/${period.multiplier}/${
        period.timespan
      }/${from.timestamp}/${to.timestamp}`

    const json = await fetch(url).then(res => res.json())
    // var result: any[] = json.map((obj: any) => ({ global: obj.global }))
    var result = json;

    result.push(...Array(Math.max(dataList.length - result.length, 0)))
    return result.reverse()
  },
}

export default radiation