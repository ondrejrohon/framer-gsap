# import GSAP TweenLite
TweenMax = require 'TweenMax'
TimelineMax = require 'TimelineMax'
FramerGSAP = require 'framer-gsap'



# Set canvas and screen colors
Canvas.backgroundColor = '#111'
Screen.backgroundColor = '#212121'


# Define controls
play = new Layer
	html: 'play_arrow'
	style: 
		'fontFamily': 'Material Icons'
		'fontSize': '88px'
		'lineHeight': '88px'
	backgroundColor: 'transparent'
	width: 87
	height: 88
	y: 1032
	x: 332

refresh = new Layer
	html: 'refresh'
	style: 
		'fontFamily': 'Material Icons'
		'fontSize': '44px'
		'lineHeight': '44px'
	backgroundColor: 'transparent'
	width: 43
	height: 44
	y: 1054
	x: 248

repeat = new Layer
	html: 'repeat'
	style: 
		'fontFamily': 'Material Icons'
		'fontSize': '44px'
		'lineHeight': '44px'
	backgroundColor: 'transparent'
	width: 43
	height: 44
	y: 1054
	x: 481


btnStyle =
	'fontSize': '28px'
	'lineHeight': '60px'
	'textAlign': 'center'

reverse = new Layer
	x: 50
	y: 1046
	width: 160
	height: 60
	backgroundColor: 'transparent'
	html: 'REVERSE'
	style: btnStyle
	
yoyo = new Layer
	x: 538
	y: 1046
	height: 60
	backgroundColor: 'transparent'
	html: 'YOYO'
	style: btnStyle

label1 = new Layer
	height: 20
	html: 'Progress'
	backgroundColor: 'transparent'
	y: 1178
	x: 72

label2 = new Layer
	height: 20
	html: 'Speed'
	backgroundColor: 'transparent'
	y: 1265
	x: 72

controlPanel = new Layer
	maxY: 1334
	width: 750
	height: 330
	backgroundColor: 'rgba(151,151,151,0.46)'

progress = new SliderComponent
	width: 606
	x: Align.center
	y: 1148

# progress.on 'change:value', ->
# 	tl.seek this.value

speed = new SliderComponent
	width: 606
	x: Align.center
	y: 1236
	value: 1
	min: 0.25
	max: 1.75



# UI events
play.onClick ->
	if play.html is 'play_arrow'
		play.html = 'pause'
		tl.play()
	else
		play.html = 'play_arrow'
		tl.pause()

repeat.onClick ->
	repeatOn = tl.repeat() is -1
	if repeatOn
		tl.repeat 0
	else 
		tl.repeat -1
		tl.restart()
		tl.play()

yoyo.onClick ->
	if tl.yoyo()
		tl.yoyo false
	else
		tl.yoyo true

reverse.onClick ->
	if tl.reverse()
		tl.reverse false
	else
		tl.reverse true

speed.on 'change:value', ->
	tl.timeScale this.value


# Define layers which we're gonna animate
a = new Layer
	midX: 375
	y: 88
	width: 88
	height: 88
	borderRadius: 44
	borderWidth: 2
	backgroundColor: 'rgba(66,165,245,0.20)'
	borderColor: 'rgba(66,165,245,0.40)'
	
b = new Layer
	midX: 375
	y: 390
	width: 72
	height: 72
	borderRadius: 148
	borderWidth: 2
	backgroundColor: 'rgba(127,57,72,0.20)'
	borderColor: 'rgba(127,57,72,0.30)'

# c = new Layer
# 	midX: 375
# 	y: 620
# 	width: 122
# 	height: 122
# 	borderRadius: 148
# 	borderWidth: 2
# 	backgroundColor: 'rgba(127,57,72,0.20)'
# 	borderColor: 'rgba(127,57,72,0.40)'


tl = new TimelineMax
	repeatDelay: 0.3
	paused: true
	onUpdate: ->
		progress.value = tl.progress()

# tl.timeScale 0.1
# tl.call => tl.seek 'jozef'

tl.to a, 1, 
	maxY: b.y
	ease: Power1.easeIn

tl.to a, 0.2, 
	borderColor: 'rgba(66,165,245,0.90)'
	'-=0.2'

tl.to b, 0.2, 
	borderColor: 'rgba(127,57,72,0.90)'
	'-=0.4'

# tl.call => tl.timeScale 0.1
	
tl.to a, 1.15, 
	backgroundColor: 'rgba(66,165,245,0.40)'
	y: '+=280'
	scale: 1.4
	ease: Power2.easeOut
	'jozef'

tl.to b, 1.15, 
	y: '+=254'
	backgroundColor: 'rgba(66,165,245,0.10)'
	borderColor: 'rgba(66,165,245,0.10)'
	scale: 0
	ease: Power2.easeOut
	'jozef'

# tl.call => tl.timeScale 1







