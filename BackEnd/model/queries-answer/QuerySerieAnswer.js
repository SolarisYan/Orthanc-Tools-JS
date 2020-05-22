const OrthancQueryAnswers = require('./OrthancQueryAnswer')

class QuerySerieAnswer extends OrthancQueryAnswers {
  constructor (answerId, answerNumber, level, studyUID, seriesUID, modality, seriesDescription, seriesNumber, originAET, numberOfSeriesRelatedInstances) {
    super(answerId, answerNumber, level, originAET, numberOfSeriesRelatedInstances)
    this.studyInstanceUID = studyUID
    this.seriesInstanceUID = seriesUID
    this.modality = modality
    this.seriesDescription = seriesDescription
    this.seriesNumber = seriesNumber
  }
}

module.exports = QuerySerieAnswer
