import { IndicatorSeries, IndicatorTemplate, KLineData } from "klinecharts"
import { getCurrentSymbolPeriod } from "./utils"

const total: IndicatorTemplate = {
  name: "TOTAL",
  shortName: "TOTAL",
  series: IndicatorSeries.Volume,
  shouldFormatBigNumber: true,
  precision: 0,
  minValue: 0,
  figures: [
    {
      key: "total",
      title: "World Total: ",
      type: "bar",
      baseValue: 0,
      styles: () => ({ color: "#FF9600" })
    }
  ],
  calc: async (dataList: KLineData[]) => {

    const { symbol, period } = getCurrentSymbolPeriod()
    const [from, to]: any[] = [dataList.at(0), dataList.at(-1)]

    const url = 
      `/world-resources/${symbol.ticker.toLowerCase()}/range/${
        period.multiplier
      }/${period.timespan}/${from.timestamp}/${to.timestamp}`

    const json = await fetch(url).then(res => res.json())
    var result: any[] = json.map((obj: any) => ({ total: obj.total }))
    result.push(...Array(Math.max(dataList.length - result.length, 0)))
    return result.reverse()
  },
}

export default total