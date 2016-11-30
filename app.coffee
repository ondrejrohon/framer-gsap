# import GSAP TweenLite
TweenMax = require 'TweenMax'
TimelineMax = require 'TimelineMax'
FramerGSAP = require 'framer-gsap'


Canvas.backgroundColor = '#111'

slider = new SliderComponent
	width: 500
	x: Align.center
	y: 1280

slider.on 'change:value', ->
	tl.seek this.value

Screen.backgroundColor = '#212121'
	
wall = new Layer
	maxY: 1334
	width: 750
	height: 100

a = new Layer
	midX: 375
	y: 40
	width: 148 * 2
	height: 148 * 2
	borderRadius: 148
	backgroundColor: '#1565C0'
	
b = new Layer
	midX: 375
	y: 510
	width: 148
	height: 148
	borderRadius: 148
	backgroundColor: '#6A1B9A'

c = new Layer
	midX: 375
	y: 800
	width: 148 * 2
	height: 148 * 2
	borderRadius: 148
	backgroundColor: '#6A1B9A'

slider = new SliderComponent
	width: 500
	x: Align.center
	y: 1280

slider.on 'change:value', ->
	tl.seek this.value

play = new Layer
	width: 100
	height: 100
	maxY: 1335
	backgroundColor: '4A148C'
	
repeat = new Layer
	width: 100
	height: 100
	maxX: 750
	maxY: 1335
	backgroundColor: '4A148C'

play.on Events.Click, ->
	if tl.progress() is 1
		tl.restart()
	else
		tl.paused !tl.paused()
	
repeat.on Events.Click, ->
	if tl.repeat() is -1 then tl.repeat(0) else tl.repeat(-1)
	if tl.progress() is 1 then tl.restart()

t1 = 0.3

tl = new TimelineMax
	repeatDelay: 0.05
	paused: true
	onUpdate: ->
		slider.value = tl.progress()

# tl.call => tl.seek 'eat2'
tl.to a, 0.2, { maxY: b.y, ease: Power1.easeIn }

tl.to a, t1, { y: '+=248', scale: 1.4, ease: Power0.easeIn }, 'eat'
tl.to b, t1, { y: '+=230', scale: 0, backgroundColor: '#1565C0', ease: Power0.easeIn }, 'eat'

tl.to a, t1, { y: '+=355', scale: 1.8, ease: Power0.easeIn }, 'eat2'
tl.to c, t1, { y: '+=294', scale: 0, backgroundColor: '#1565C0', ease: Power0.easeIn }, 'eat2'

tl.to wall, 0.2, { y: '+=200', backgroundColor: '#212121' }, 'hit'
tl.to a, 0.2, { y: '-=1000', scale: 10 }, 'hit'

tl.timeScale 0.4
