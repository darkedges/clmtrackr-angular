import { emotionModel } from './EmotionalModel';

export class EmotionClassifier {

  private previousParameters: number[] = [];
  private classifier: any = {};
  private emotions: any[] = [];
  private coefficient_length: number;

  constructor() {
    for (const m of Object.keys(emotionModel)) {
      this.emotions.push(m);
      this.classifier[m] = {};
      this.classifier[m]['bias'] = emotionModel[m]['bias'];
      this.classifier[m]['coefficients'] = emotionModel[m]['coefficients'];
    }
    this.coefficient_length = this.classifier[this.emotions[0]]['coefficients'].length;
  }

  private predict(parameters: any) {
    const prediction: any = [];
    for (let j = 0; j < this.emotions.length; j++) {
      const e = this.emotions[j];
      let score = this.classifier[e].bias;
      for (let i = 0; i < this.coefficient_length; i++) {
        score += this.classifier[e].coefficients[i] * parameters[i + 6];
      }
      prediction[j] = { 'emotion': e, 'value': 0.0 };
      prediction[j]['value'] = 1.0 / (1.0 + Math.exp(-score)) * 100;
    }
    return prediction;
  }

  public meanPredict(parameters: any) {
    //  console.log(parameters)
    // store to array of 10 previous parameters
    this.previousParameters.splice(0, this.previousParameters.length === 10 ? 1 : 0);
    //  console.log(this.previousParameters)
    this.previousParameters.push(parameters.slice(0));

    if (this.previousParameters.length > 9) {
      // calculate mean of parameters?
      const meanParameters: any[] = [];
      for (let i = 0; i < parameters.length; i++) {
        meanParameters[i] = 0;
      }
      for (let i = 0; i < this.previousParameters.length; i++) {
        for (let j = 0; j < parameters.length; j++) {
          meanParameters[j] += this.previousParameters[i][j];
        }
      }
      for (let i = 0; i < parameters.length; i++) {
        meanParameters[i] /= 10;
      }

      // calculate logistic regression
      return this.predict(meanParameters);
    } else {
      return false;
    }
  }
}
