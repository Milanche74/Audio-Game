


// take care of audio

const context = new AudioContext() 
    

const masterGain = new GainNode(context, {gain: 0.3})
const bassGain = new GainNode(context, {gain: 0})
const otherGain = new GainNode(context, {gain: 0})
const muffledSound = new BiquadFilterNode(context, {
    type: 'highshelf',
    frequency: 1000,
    gain: 0
})
const analyzer = new AnalyserNode(context, {fftSize: 1024})

let verseReady = false;
let bridgeReady = false;
let refrainReady = false;    

const graph = document.querySelector('#audio-graph')

// will refactor eventually

const bass = document.querySelector('.bass') 
const bridge = document.querySelector('.bridge') 
const drums = document.querySelector('.drums') 
const other = document.querySelector('.other')
const verse1 = document.querySelector('.verse1')
const verse2 = document.querySelector('.verse2')
const refrain = document.querySelector('.refrain')



const bassTrack = context.createMediaElementSource(bass) 
const bridgeTrack = context.createMediaElementSource(bridge)
const drumsTrack = context.createMediaElementSource(drums)
const otherTrack = context.createMediaElementSource(other)
const verse1Track = context.createMediaElementSource(verse1)
const verse2Track = context.createMediaElementSource(verse2)
const refrainTrack = context.createMediaElementSource(refrain)

bassTrack.connect(bassGain).connect(muffledSound).connect(masterGain).connect(analyzer).connect(context.destination)
bridgeTrack.connect(muffledSound).connect(masterGain).connect(analyzer).connect(context.destination)
drumsTrack.connect(muffledSound).connect(masterGain).connect(analyzer).connect(context.destination)
otherTrack.connect(otherGain).connect(muffledSound).connect(masterGain).connect(analyzer).connect(context.destination)
verse1Track.connect(muffledSound).connect(masterGain).connect(analyzer).connect(context.destination)
verse2Track.connect(muffledSound).connect(masterGain).connect(analyzer).connect(context.destination)
refrainTrack.connect(muffledSound).connect(masterGain).connect(analyzer).connect(context.destination)


// initialize kaboom game layout

kaboom({
    width: 800,
    height: 576,
    background: [135,206,235],
    debug: true
})

// load sprites

loadRoot('Visual/')
loadSprite('blockade','blockade.ico')
loadSprite('bridge-left', 'bridge-left.ico')
loadSprite('bridge-right', 'bridge-right.ico')
loadSprite('bridge-text', 'bridge-text.ico')
loadSprite('cloud', 'cloud.ico')
loadSprite('drum', 'drum.png')
loadSprite('foe', 'foe.ico')
loadSprite('ground', 'ground.ico')
loadSprite('guitar', 'guitar.png')
loadSprite('microphone', 'microphone.png')
loadSprite('keyboard', 'piano.png')
loadSprite('platform', 'platform.ico')
loadSprite('player', 'player.ico')
loadSprite('player-moving', 'player-moving.ico')
loadSprite('refrain', 'refrain-text.ico')
loadSprite('headphones', 'headphone.ico')

// some useful variables

const moveSpeed = 400
let enemySpeed = -50
const jumpForce = 800


// define a scene

scene('game', () =>{
    
    layers(['obj', 'ui'],'obj')

    const map = [
        '           *         *           *     *           ¤   *      *     !*      *=',   
        '                          *         *      *       #*      *        !     *  =',        
        '   *           *               < & ¤ >         *   #    = r =     * !   *    =',        
        '#       *                  €   ======#             ?    >===<       !       +=',                      
        '#             %            =         #             ?  =             !       ==',        
        '#         =====        ==            #             #                !      ===', 
        '#                                    #    < ¤>     # ________________     ====',       
        '#      @     ¤                       <b ¤>____<    >_<              >_   =====',        
        '____________________________________________________<                >________'        
    ]
    const levelCfg = {
        width: 64,
        height: 64,
        '#': () => [
            sprite('blockade'),
            area(),
            solid(),
            'blockade'
            
        ],
        '?': () => [
            sprite('blockade'),
            area(),
            solid(),
            'bridge-destroy'
        ],
        '!': () => [
            sprite('blockade'),
            area(),
            solid(),
            'refrain-destroy'
        ],
        '<': () => [  
            sprite('bridge-left'),
            area(),
            solid(),
            'left'
        ],
        '>': () => [
            sprite('bridge-right'),
            area(),
            solid(),
            'right'
        ],
        'b': () => [
            sprite('bridge-text'),
            area(),
            'bridge-text'
        ],
        '*': () => [
            sprite('cloud'),
        
        ],
        '@': ()=> [
            sprite('drum'),
            area(),
            scale(.8),
            'drums'
        ],
        '¤': ()=> [
            sprite('foe'),
            area(),
            body(),
            'foe',
            {speed: -50}
        ],          
        '_': () => [
            sprite('ground'),
            area(),
            solid()
        ],
        '%': ()=> [
            sprite('guitar'),
            area(),
            scale(.1),
            'guitar'
        ],
        '+': () => [
            sprite('headphones'),
            area(),
            'headphones'
        ],
        '&': () => [
            sprite('microphone'),
            area(),
            scale(.1),
            'microphone'
        ],
        '€': ()=> [
            sprite('keyboard'),
            area(),
            scale(.1),
            'keys'
        ],
        '=': ()=> [
            sprite('platform'),
            area(),
            solid()
        ],
        'r': ()=> [
            sprite('refrain'),
            area(),
            'refrain-text'
        ]       
    }
    console.log()

    const gameLevel = addLevel(map, levelCfg)

    add([
        text(`Let's play!`),
        pos(140, 20),
        layer('ui')

    ])

    const player = add([
        sprite('player'), 
        area(),
        pos(200, 200),
        body(),
        "player"
        
    ])

    // make the camera follow player
    player.onUpdate(()=> {
        let currCamPos = camPos()
        if(currCamPos.x < player.pos.x) {
            camPos(player.pos.x, currCamPos.y)
        } else if( (currCamPos.x - player.pos.x) > 200 ) {
            camPos(player.pos.x + 200, currCamPos.y)
        }
        
    })

    
    onUpdate('foe', (f) => {
         f.move(f.speed, 0)
    }) 

    // only solution for changing the directions in which foe's go
    onCollide('foe', 'left',(f)=> {
       f.speed = 50
    })
    onCollide('foe', 'right',(f)=> {
       f.speed = -50;        
    })


    onKeyDown("right", () => {
        player.move(moveSpeed, 0)
        player.use(sprite('player-moving'))
    })
    onKeyDown("left", () => {
        player.move(-moveSpeed, 0)
        player.use(sprite('player-moving'))
    })
    onKeyRelease(["right", "left"], ()=> {
        player.use(sprite('player'))
    })
    onKeyPress(["space", "up"], ()=> {
        if(player.isGrounded()) {
            player.jump(jumpForce)
        }
    })

    player.onCollide("foe", (f) => {
        shake(10) 
        muffledSound.gain.setTargetAtTime(-20, context.currentTime, 0.5)
        setTimeout(()=>{
            muffledSound.gain.setTargetAtTime(0, context.currentTime, 0.5)
        }, 2000)
    }) 

    player.onCollide('drums', (d)=> { 
        if(context.state === 'suspended') {
            context.resume()
        }
        bass.play()
        other.play()
        drums.play()
        d.destroy()
    })

    player.onCollide('guitar', (g)=> {
        g.destroy()
        bassGain.gain.setTargetAtTime(1, context.currentTime, 0.01)
    })
    player.onCollide('keys', (k)=> {
        k.destroy()
        otherGain.gain.setTargetAtTime(1, context.currentTime, 0.1)
    })
    player.onCollide('microphone', (m)=> {
        m.destroy()
        verseReady = true
    })
    player.onCollide('bridge-text',(bt)=> {
        bt.destroy() 
        bridgeReady = true
        add([
            text(`Wait for the bridge!`, {size: 36}),
            pos(player.pos.x + 256, 20),
            layer('ui')
        ])
    })
    player.onCollide('refrain-text', (rt)=> {
        rt.destroy()
        refrainReady = true 
        add([ 
            text(`Wait for the refrain!`, {size: 36}),
            pos(player.pos.x + 206, 20),
            layer('ui')
        ])
    })
    player.onCollide('headphones', (hd)=> {
        hd.destroy()
        getSongInfo()
        add([ 
            text(`Song is here!`, {size: 36}),
            pos(player.pos.x, 20),
            layer('ui')
        ])
    })


    // event listener when playback ended
    drums.addEventListener('ended', ()=> {
        drums.currentTime = 0;
        other.currentTime = 0;
        bass.currentTime = 0;
        
        if(!verseReady) {
            bass.play()
            other.play()
            drums.play()
        } else {
            verse1.play()
            bass.pause()
            other.pause()
            drums.pause()
 
            
        }
    }) 

    verse1.addEventListener('ended', ()=> {
        
        verse1.pause()

        if(!bridgeReady) {
            verse2.play()
        } else {
            every('bridge-destroy', destroy)
            bridge.play()
        }
    })

    verse2.addEventListener('ended', () => {
        verse2.pause()

        if(!bridgeReady) {
            verse1.play()
        } else {
            every('bridge-destroy', destroy)
            bridge.play()
        }
    })

    bridge.addEventListener('ended', ()=> {
        bridge.pause()

        if(refrainReady) {
            refrain.play()
            every('refrain-destroy', destroy)
        } else {
            bridge.currentTime = 0  
            bridge.play()  
        }  
    })

})

const setSongInfo= (data) => {
    
    const songInfo = document.createElement('div')
    const nameLabel = document.createElement('div')
    const titleLabel = document.createElement('div')
    const releaseDate = document.createElement('div')
    const albumLabel = document.createElement('div')
    const spotify = document.createElement('a')

    const image = document.createElement('img') 

    nameLabel.innerHTML = data.artist
    titleLabel.innerHTML = data.title
    releaseDate.innerHTML = data.released 
    albumLabel.innerHTML = `Album: ${data.album}`
    spotify.innerHTML = 'Listen on Spotify'
    spotify.setAttribute('href', data.spotify)
    image.setAttribute('src', data.image)


    songInfo.append(titleLabel, nameLabel, releaseDate, albumLabel, spotify, image)
    
    songInfo.classList.add('song-info')

    songInfo.style.width = `${window.innerWidth - 840}px`    
    
    document.body.appendChild(songInfo)
    
}

const getSongInfo = () => {
    
    fetch('http://localhost:8000/search').then(response=> response.json()).then(data=> setSongInfo(data))
    
}

graph.style.width = `${window.innerWidth - 800}px`
graph.style.height = `${200}px`
graph.style.top = `${576 - 200}px`


const drawAudioGraph = () => {
        
    requestAnimationFrame(drawAudioGraph)
    
    const bufferLength = analyzer.frequencyBinCount
    
    //empty array to be populated with analyzer value
    const dataArray = new Uint8Array(bufferLength)
    analyzer.getByteFrequencyData(dataArray)

    const width = graph.width
    const height = graph.height
    const barWidth = width / bufferLength * 2

    const canvasContext = graph.getContext('2d')
    canvasContext.clearRect(0, 0, width, height)

    dataArray.forEach((item,index)=> {
        const y = item / 255 * height / 1.5
        const x = barWidth * index

        canvasContext.fillStyle = `hsl(${184 - index * 0.725}, 100%, 50%)`
        canvasContext.fillRect(x, height - y, barWidth, y)
    })

}

const resize = () => {
    graph.width = graph.clientWidth * window.devicePixelRatio
    graph.height = graph.clientHeight * window.devicePixelRatio
}

resize()
drawAudioGraph()









go('game')