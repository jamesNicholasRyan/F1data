import BAK from '../assets/circuitMaps/BAK.png'
import jerez from '../assets/circuitMaps/jerez.svg'
import adelaide from '../assets/circuitMaps/adelaide.svg'
import ainDiab from '../assets/circuitMaps/ain-diab.png'
import aintree from '../assets/circuitMaps/aintree.svg'
import albert_park from '../assets/circuitMaps/albert_park.svg'
import americas from '../assets/circuitMaps/americas.svg'
import anderstorp from '../assets/circuitMaps/anderstorp.svg'
import avus from '../assets/circuitMaps/avus.svg'
import bahrain from '../assets/circuitMaps/bahrain.svg'
import boavista from '../assets/circuitMaps/boavista.svg'
import brands_hatch from '../assets/circuitMaps/brands_hatch.svg'
import bremgarten from '../assets/circuitMaps/bremgarten.png'
import buddh from '../assets/circuitMaps/buddh.svg'
import catalunya from '../assets/circuitMaps/catalunya.svg'
import charade from '../assets/circuitMaps/charade.png'
import dallas from '../assets/circuitMaps/dallas.svg'
import detroit from '../assets/circuitMaps/detroit.svg'
import dijon from '../assets/circuitMaps/dijon.svg'
import donington from '../assets/circuitMaps/donington.svg'
import essarts from '../assets/circuitMaps/essarts.svg'
import estoril from '../assets/circuitMaps/estoril.svg'
import fuji from '../assets/circuitMaps/fuji.svg'
import galvez from '../assets/circuitMaps/galvez.svg'
import george from '../assets/circuitMaps/george.svg'
import hanoi from '../assets/circuitMaps/hanoi.png'
import hockenheimring from '../assets/circuitMaps/hockenheimring.svg'
import hungaroring from '../assets/circuitMaps/hungaroring.svg'
import imola from '../assets/circuitMaps/imola.svg'
import indianapolis from '../assets/circuitMaps/indianapolis.svg'
import interlagos from '../assets/circuitMaps/interlagos.svg'
import istanbul from '../assets/circuitMaps/istanbul.svg'
import jacarepagua from '../assets/circuitMaps/jacarepagua.svg'
import jarama from '../assets/circuitMaps/jarama.svg'
import kyalami from '../assets/circuitMaps/kyalami.png'
import lemans from '../assets/circuitMaps/lemans.png'
import long_beach from '../assets/circuitMaps/long_beach.png'
import magny_cours from '../assets/circuitMaps/magny_cours.svg'
import marina_bay from '../assets/circuitMaps/marina_bay.svg'
import monaco from '../assets/circuitMaps/monaco.svg'
import monsanto from '../assets/circuitMaps/monsanto.png'
import montjuic from '../assets/circuitMaps/montjuic.png'
import monza from '../assets/circuitMaps/monza.svg'
import mosport from '../assets/circuitMaps/mosport.svg'
import mugello from '../assets/circuitMaps/mugello.svg'
import nivelles from '../assets/circuitMaps/nivelles.png'
import nurburgring from '../assets/circuitMaps/nurburgring.svg'
import okayama from '../assets/circuitMaps/okayama.png'
import pedralbes from '../assets/circuitMaps/pedralbes.png'
import pescara from '../assets/circuitMaps/pescara.svg'
import phoenix from '../assets/circuitMaps/phoenix.svg'
import port_imperial from '../assets/circuitMaps/port_imperial.svg'
import portimao from '../assets/circuitMaps/portimao.svg'
import red_bull_ring from '../assets/circuitMaps/red_bull_ring.svg'
import reims from '../assets/circuitMaps/reims.png'
import ricard from '../assets/circuitMaps/ricard.png'
import rodriguez from '../assets/circuitMaps/rodriguez.svg'
import sebring from '../assets/circuitMaps/sebring.svg'
import sepang from '../assets/circuitMaps/sepang.svg'
import shanghai from '../assets/circuitMaps/shanghai.svg'
import silverstone from '../assets/circuitMaps/silverstone.png'
import sochi from '../assets/circuitMaps/sochi.svg'
import spa from '../assets/circuitMaps/spa.svg'
import suzuka from '../assets/circuitMaps/suzuka.svg'
import tremblant from '../assets/circuitMaps/tremblant.svg'
import valencia from '../assets/circuitMaps/valencia.svg'
import villeneuve from '../assets/circuitMaps/villeneuve.svg'
import watkins_glen from '../assets/circuitMaps/watkins_glen.svg'
import yas_marina from '../assets/circuitMaps/yas_marina.svg'
import yeongam from '../assets/circuitMaps/yeongam.svg'
import zandvoort from '../assets/circuitMaps/zandvoort.svg'
import zeltweg from '../assets/circuitMaps/zeltweg.png'
import zolder from '../assets/circuitMaps/zolder.svg'

const getCircuitMaps = () => {
  return {
    BAK,
    jerez,
    adelaide,
    'ain-diab': ainDiab,
    aintree,
    albert_park,
    americas,
    anderstorp,
    avus,
    bahrain,
    boavista,
    brands_hatch,
    bremgarten,
    buddh,
    catalunya,
    charade,
    dallas,
    detroit,
    dijon,
    donington,
    essarts,
    estoril,
    fuji,
    galvez,
    george,
    hanoi,
    hockenheimring,
    hungaroring,
    imola,
    indianapolis,
    interlagos,
    istanbul,
    jacarepagua,
    jarama,
    kyalami,
    lemans,
    long_beach,
    magny_cours,
    marina_bay,
    monaco,
    monsanto,
    montjuic,
    monza,
    mosport,
    mugello,
    nivelles,
    nurburgring,
    okayama,
    pedralbes,
    pescara,
    phoenix,
    port_imperial,
    portimao,
    red_bull_ring,
    reims,
    ricard,
    rodriguez,
    sebring,
    sepang,
    shanghai,
    silverstone,
    sochi,
    spa,
    suzuka,
    tremblant,
    valencia,
    villeneuve,
    watkins_glen,
    yas_marina,
    yeongam,
    zandvoort,
    zeltweg,
    zolder
  }
}

export default getCircuitMaps

// const fs = require('fs')

// let str = ''

// fs.readdirSync('/Users/samrosser/development/ga/GA02-F1CircuitMapper/src/assets/circuitMaps').forEach(file => {
//   const track = file.split('.')[0]
//   str += `${track},`
//   // str += `import ${track} from '../assets/circuitMaps/${file}'`
//   str += '\n'
// })

// console.log(str)

