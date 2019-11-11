declare var gtag: UniversalAnalytics.ga;

//THE TIMEOUT IN MS
const TIMEOUTMS = 2000;

//Logs the input to google analytics
export default function logEntry(eventName: string, value : string, previousTimer: number, setLastTimer: (i: any) => void) {
  
    var label = value.length > 10 ? value.substring(0,9) : value;
  
    function sendTagEvent() {
  
      // console && console.log && console.log('Send' + eventName + ' "' + label + '"');

      //google
      if(gtag){
        gtag('event', eventName, {
          'event_category': 'input',
          'event_label': label
        });
      }
    }
  
    clearTimeout(previousTimer);
  
    setLastTimer(setTimeout(sendTagEvent, TIMEOUTMS));
  }
  