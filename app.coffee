# import GSAP TweenLite
TweenMax = require 'TweenMax'
TimelineMax = require 'TimelineMax'
FramerGSAP = require 'framer-gsap'


Canvas.backgroundColor = '#111'

bg = new BackgroundLayer
	backgroundColor: '#212121'
	
wall = new Layer
	maxY: 1334
	width: 750
	height: 100

a = new Layer
	midX: 375
	y: 0
	width: 148 * 2
	height: 148 * 2
	borderRadius: 148
	backgroundColor: '#1565C0'
	
b = new Layer
	midX: 375
	y: 400
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

t1 = 0.3

tl = new TimelineMax
	repeat: -1
	repeatDelay: 0.05
	paused: true

# tl.call => tl.seek 'eat2'
tl.to a, 0.2, { maxY: b.y, ease: Power1.easeIn }

tl.to a, t1, { y: '+=248', scale: 1.4, ease: Power0.easeIn }, 'eat'
tl.to b, t1, { y: '+=230', scale: 0, backgroundColor: '#1565C0', ease: Power0.easeIn }, 'eat'

tl.to a, 0.1, { y: '+=95', ease: Power0.easeIn }, 'next'

tl.to a, t1, { y: '+=372', scale: 1.8, ease: Power0.easeIn }, 'eat2'
tl.to c, t1, { y: '+=286', scale: 0, backgroundColor: '#1565C0', ease: Power0.easeIn }, 'eat2'

# tl.to a, 0.1, { maxY: wall.y - 119, ease: Power0.easeIn }
tl.to wall, 0.2, { y: '+=200', backgroundColor: '#212121' }, 'hit'
tl.to a, 0.2, { y: '-=1000', scale: 10 }, 'hit'

tl.timeScale 0.4
