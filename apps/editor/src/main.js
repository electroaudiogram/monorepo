import { StrudelMirror } from '@strudel/codemirror'
import { evalScope } from '@strudel/core'
import { drawPianoroll } from '@strudel/draw'
import { transpiler } from '@strudel/transpiler'
import {
  getAudioContext,
  initAudioOnFirstClick,
  registerSynthSounds,
  webaudioOutput,
} from '@strudel/webaudio'

// init canvas
const canvas = document.getElementById('roll')
canvas.width = canvas.width * 2
canvas.height = canvas.height * 2
const drawContext = canvas.getContext('2d')
const drawTime = [-2, 2] // time window of drawn haps

const editor = new StrudelMirror({
  defaultOutput: webaudioOutput,
  getTime: () => getAudioContext().currentTime,
  transpiler,
  root: document.getElementById('editor'),
  drawTime,
  onDraw: (haps, time) =>
    drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
  initialCode: `
    await samples('github:tidalcycles/dirt-samples')
    await samples(
      'https://raw.githubusercontent.com/electroaudiogram/tidal-drum-machines/refs/heads/main/tidal-drum-machines.json',
      'github:electroaudiogram/tidal-drum-machines/main/machines/'
    )

    setCpm(120/4)
    sound("bd hh sd oh")
  `,
  prebake: async () => {
    initAudioOnFirstClick() // needed to make the browser happy (don't await this here..)

    const loadModules = evalScope(
      import('@strudel/core'),
      import('@strudel/draw'),
      import('@strudel/mini'),
      import('@strudel/tonal'),
      import('@strudel/webaudio'),
    )
    await Promise.all([loadModules, registerSynthSounds()])
  },
})

document
  .getElementById('play')
  .addEventListener('click', () => editor.evaluate())
document.getElementById('stop').addEventListener('click', () => editor.stop())
