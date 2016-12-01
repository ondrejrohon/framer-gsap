# import GSAP TweenLite
TweenMax = require 'TweenMax'
TimelineMax = require 'TimelineMax'
FramerGSAP = require 'framer-gsap'


Canvas.backgroundColor = '#111'
Screen.backgroundColor = '#212121'
	
control = new Layer
	maxY: 1334
	width: 750
	height: 100
	backgroundColor: 'rgba(151,151,151,0.46)'

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

slider = new SliderComponent
	width: 500
	x: Align.center
	y: 1280

# slider.on 'change:value', ->
# 	tl.seek this.value


tl = new TimelineMax
	repeat: -1
	repeatDelay: 0.2
# 	paused: true
	onUpdate: ->
		slider.value = tl.progress()

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







