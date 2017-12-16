import { ElementRef } from '@angular/core';
import { EmotionClassifier } from './emotionClassifier';

declare var clm: any;

export class FaceTracker {

  private _video: ElementRef;
  private _videoReady = false;
  private _overlayCC: ElementRef;
  private _picture: ElementRef;
  private _ctracker: any;
  private _positions: any;
  private _emotion: EmotionClassifier;

  constructor(video: ElementRef, overlayCC: ElementRef, picture: ElementRef, videoReady: boolean) {
    this._video = video;
    this._overlayCC = overlayCC;
    this._videoReady = videoReady;
    this._picture = picture;
    this._emotion = new EmotionClassifier();
  }


  public startTracker() {
    this._ctracker = new clm.tracker();
    this._ctracker.init(clm.model_pca_20_svm);

    this._ctracker.start(this._video.nativeElement);

    this.drawLoop();
    //  this.positionLoop();
  }

  private drawLoop = () => {
    const canvasInput = this._overlayCC.nativeElement;

    if (this._ctracker.getCurrentPosition()) {

      const cc = canvasInput.getContext('2d');
      let er = '';

      cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
      this._ctracker.draw(canvasInput);
      let positions = this._ctracker.getCurrentParameters();
      er = this._emotion.meanPredict(positions);

      positions = this._ctracker.getCurrentParameters();
      er = this._emotion.meanPredict(positions);

      if (er) {
        let positionString = '';
        for (let p = 0; p < er.length; p++) {

          positionString += 'emotion ' + er[p]['emotion'] + ': [' + er[p]['value'].toFixed(1) + ']<br/>';
          if (er[p]['emotion'] === 'happy') {
            console.log(er[p]['value'].toFixed(1));
            if (er[p]['value'].toFixed(1) > 70) {
              this.takeApicture(canvasInput);
            }
          }
        }


        document.getElementById('positions').innerHTML = positionString;
      }
    }

    requestAnimationFrame(this.drawLoop);
  }

  private positionLoop = () => {


    const positions = this._ctracker.getCurrentPosition();
    //    console.log(' position ' +positions)
    // do something with the positions ...
    // print the positions
    let positionString = '';
    if (positions) {
      for (let p = 0; p < 36; p++) {
        positionString += 'featurepoint ' + p + ' : [' + positions[p][0].toFixed(2) + ',' + positions[p][1].toFixed(2) + ']<br/>';
      }
      document.getElementById('positions').innerHTML = positionString;
    }
    requestAnimationFrame(this.positionLoop);
  }

  private takeApicture(canvasInput: any) {
    const picture = this._picture.nativeElement;
    const picturcc = picture.getContext('2d');

    picturcc.drawImage(this._video.nativeElement, 0, 0, canvasInput.width, canvasInput.height);
  }

}
