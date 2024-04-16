import { Coordinate, ExcludePickPartial, getFigureClass, Indicator, IndicatorDrawParams, IndicatorSeries, IndicatorTemplate, KLineData, Overlay, OverlayCreateFiguresCallback, OverlayCreateFiguresCallbackParams, OverlayFigure, OverlayTemplate, TextAttrs } from "klinecharts";


const wars: ExcludePickPartial<Overlay, "name"> = {
  name: 'wars',
  visible: true,
  lock: true,
  needDefaultPointFigure: false,
  // needDefaultXAxisFigure: true,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  createPointFigures,
  onRightClick: () => true,
  onMouseEnter: ({ overlay, x }) => { 
    overlay.extendData.hoverData.active = true;
    overlay.extendData.hoverData.lineX = x;
    return true 
  },
  onMouseLeave: ({ overlay }) => { 
    overlay.extendData.hoverData.active = false;
    return true 
  },
  onClick: () => true,
  onSelected: () => true,
  onPressedMoving: () => true,
  onDeselected: () => true,
  onPressedMoveEnd: () => true,
  onPressedMoveStart: () => true,
  onDrawEnd: () => true,
  onDrawing: () => true,
  onDrawStart: () => true,
}

interface TextOverlayFigure extends OverlayFigure {
  attrs: TextAttrs
}

function createPointFigures(params: OverlayCreateFiguresCallbackParams): OverlayFigure | OverlayFigure[] {
  const coordinates = params.coordinates;

  const data = coordinates.reduce((result: { name: string , cords: Coordinate[] }[], current, i, arr) => {
      if ((i % 2 === 0) && (current.x - arr[i + 1].x !== 0)) {
          result.push({ 
            name: params.overlay.extendData.data[i / 2].name, 
            cords: [current, arr[i + 1]] 
          });
      }
      return result;
  }, []);

  function createConflictFigure({ name, cords }: { name: string, cords: Coordinate[] }): OverlayFigure[] {
    const start: OverlayFigure = {
      type: "line",
      attrs: {
        coordinates: [
          { x: cords[0].x, y: 0 },
          { x: cords[0].x, y: params.bounding.height },
        ],
      },
      styles: { style: "dashed", color: "#ff00004d" },
    };

    const end: OverlayFigure = {
      type: "line",
      attrs: {
        coordinates: [
          { x: cords[1].x, y: 0 },
          { x: cords[1].x, y: params.bounding.height },
        ],
      },
      styles: { style: "dashed", color: "#0000ff4d" },
    };

    return [start, end]
  }

  var figures: OverlayFigure[] = data.flatMap(createConflictFigure);

  const { active, lineX }: { active: boolean, lineX: number } = params.overlay.extendData.hoverData

  const allXCords = data.flatMap(war => [ war.cords[0].x, war.cords[1].x ])
  const closestX = allXCords.reduce((prev, curr, i, arr) => {
    return Math.abs(lineX - curr) < Math.abs(lineX - prev) ? curr : prev
  })

  if (active) {
    const warsStarting = data.filter(war => {
      return war.cords[0].x == closestX;
    });

    const warsEnding = data.filter(war => {
      return war.cords[1].x == closestX;
    });

    const lineXP = warsStarting[0]?.cords[0].x | warsEnding[0]?.cords[1].x

    for (const [index, war] of warsStarting.entries()) {
      const text: TextOverlayFigure = {
        type: "text",
        attrs: {
          x: lineXP - 3,
          y: params.bounding.height - (12 * index),
          text: war.name,
          align: "right",
          baseline: "bottom"
        },
        styles: { color: "#ff00004d" }
      }
      figures.push(text)
    }

    for (const [index, war] of warsEnding.entries()) {
      const text: TextOverlayFigure = {
        type: "text",
        attrs: {
          x: lineXP + 3,
          y: params.bounding.height - (12 * index),
          text: war.name,
          align: "left",
          baseline: "bottom"
        },
        styles: { color: "#0000ff4d" }
      }
      figures.push(text)
    }
  }

  return figures
}

export default wars