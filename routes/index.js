// file that contains the routes of the api
'use strict'

const express = require('express')

const userCtrl = require('../controllers/all/user')
const groupCtrl = require('../controllers/all/group')
const promCtrl = require('../controllers/all/group/prom')
const sectionPromsCtrl = require('../controllers/user/patient/section-proms')
const patientPromCtrl = require('../controllers/user/patient/patient-prom')
const structurePromCtrl = require('../controllers/all/group/proms-structure')
const langCtrl = require('../controllers/all/lang')

const patientCtrl = require('../controllers/user/patient')

const exportCtrl = require('../controllers/user/patient/export')

const socialInfoCtrl = require('../controllers/user/patient/social-info')
const weightCtrl = require('../controllers/user/patient/weight')
const heightCtrl = require('../controllers/user/patient/height')
const medicationCtrl = require('../controllers/user/patient/medication')
const othermedicationCtrl = require('../controllers/user/patient/other-medication')
const vaccinationCtrl = require('../controllers/user/patient/vaccination')
const medicalcareCtrl = require('../controllers/user/patient/medical-care')
const clinicalTrialCtrl = require('../controllers/user/patient/clinical-trial')
const phenotypeCtrl = require('../controllers/user/patient/phenotype')
const genotypeCtrl = require('../controllers/user/patient/genotype')

const admninAnswersCtrl = require('../controllers/admin/stats-answers')
const admninStatsCtrl = require('../controllers/admin/stats')
const admninUsersCtrl = require('../controllers/admin/users')
const admninLangCtrl = require('../controllers/admin/lang')
const admninQnaCtrl = require('../controllers/admin/qna')

const superadmninQnaCtrl = require('../controllers/superadmin/qna')
const superAdmninLangCtrl = require('../controllers/superadmin/lang')

const seizuresCtrl = require('../controllers/user/patient/seizures')

const supportCtrl = require('../controllers/all/support')

const botQnaCntrl = require('../controllers/bot/botQnaCntrl')

const alertsCtrl = require('../controllers/all/alerts')
const useralertsCtrl = require('../controllers/all/useralerts')

const f29gatewayCtrl = require('../services/f29gateway')

const f29azureserviceCtrl = require('../services/f29azure')

const auth = require('../middlewares/auth')
const roles = require('../middlewares/roles')

const api = express.Router()

// user routes, using the controller user, this controller has methods
//routes for login-logout
api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)
api.post('/signin/registerUserInAuthy', userCtrl.registerUserInAuthy)
api.post('/signin2FA', userCtrl.signin2FA)

// activarcuenta
api.post('/activateuser', userCtrl.activateUser)

// recuperar password
api.post('/recoverpass', userCtrl.recoverPass)
api.post('/updatepass', userCtrl.updatePass)
api.post('/newpass', auth(roles.All), userCtrl.newPass)

api.get('/users/:userId', auth(roles.All), userCtrl.getUser)
api.get('/users/settings/:userId', auth(roles.All), userCtrl.getSettings)
api.put('/users/:userId', auth(roles.AllLessResearcher), userCtrl.updateUser)
api.delete('/users/:userId', auth(roles.AllLessResearcher), userCtrl.deleteUser)//de momento no se usa

//export data
api.get('/exportdata/:patientId', auth(roles.All), exportCtrl.exportData)
api.post('/exportsubgroups', auth(roles.Admin), exportCtrl.exportSubgroups)
api.get('/sections/group/:groupName', auth(roles.All), exportCtrl.getSectionsGroup)


// patient routes, using the controller patient, this controller has methods
api.get('/patients-all/:userId', auth(roles.All), patientCtrl.getPatientsUser)
api.get('/patients/:patientId', auth(roles.All), patientCtrl.getPatient)
api.post('/patients/:userId', auth(roles.OnlyUser), patientCtrl.savePatient)
api.put('/patients/:patientId', auth(roles.AllLessResearcher), patientCtrl.updatePatient)
api.delete('/patients/:patientId', auth(roles.OnlyUser), patientCtrl.deletePatient)//de momento no se usa
api.post('/patients/updateSubscriptionTrue/:patientId', auth(roles.OnlyUser), patientCtrl.addSubscriptionToGroupAlerts)
api.post('/patients/updateSubscriptionFalse/:patientId', auth(roles.OnlyUser), patientCtrl.deleteSubscriptionToGroupAlerts)
api.get('/patients/getSubscriptionToGroupAlerts/:patientId', auth(roles.UserResearcher), patientCtrl.getSubscriptionToGroupAlerts)

// socialinfo routes, using the controller socialinfo, this controller has methods
api.get('/socialinfos/:patientId', auth(roles.UserResearcher), socialInfoCtrl.getSocialInfo)
api.post('/socialinfos/:patientId', auth(roles.OnlyUser), socialInfoCtrl.saveSocialInfo)
api.put('/socialinfos/:socialInfoId', auth(roles.OnlyUser), socialInfoCtrl.updateSocialInfo)
api.delete('/socialinfos/:socialInfoId', auth(roles.OnlyUser), socialInfoCtrl.deleteSocialInfo)

// weightinfo routes, using the controller socialinfo, this controller has methods
api.get('/weight/:patientId', auth(roles.UserResearcher), weightCtrl.getWeight)
api.get('/weights/:patientId', auth(roles.UserResearcher), weightCtrl.getHistoryWeight)
api.post('/weight/:patientId', auth(roles.OnlyUser), weightCtrl.saveWeight)
api.put('/weight/:weightId', auth(roles.OnlyUser), weightCtrl.updateWeight)
api.delete('/weight/:weightId', auth(roles.OnlyUser), weightCtrl.deleteWeight)//de momento no se usa

// heighteinfo routes, using the controller socialinfo, this controller has methods
api.get('/height/:patientId', auth(roles.UserResearcher), heightCtrl.getHeight)
api.get('/heights/:patientId', auth(roles.UserResearcher), heightCtrl.getHistoryHeight)
api.post('/height/:patientId', auth(roles.OnlyUser), heightCtrl.saveHeight)
api.put('/height/:heightId', auth(roles.OnlyUser), heightCtrl.updateHeight)
api.delete('/height/:heightId', auth(roles.OnlyUser), heightCtrl.deleteHeight)//de momento no se usa

// heighteinfo routes, using the controller socialinfo, this controller has methods
api.get('/medications/:patientId', auth(roles.UserResearcher), medicationCtrl.getMedications)
api.get('/medication/:medicationId', auth(roles.UserResearcher), medicationCtrl.getMedication)
api.post('/medication/:patientId', auth(roles.OnlyUser), medicationCtrl.saveMedication)
api.put('/medication/:medicationId', auth(roles.OnlyUser), medicationCtrl.updateMedication)
api.delete('/medication/:medicationId', auth(roles.OnlyUser), medicationCtrl.deleteDose)
api.delete('/medications/:drugNameAndPatient', auth(roles.OnlyUser), medicationCtrl.deleteMedication)
api.get('/medications/all/:drugNameAndPatient', auth(roles.UserResearcher), medicationCtrl.getAllMedicationByNameForPatient)

api.delete('/medications/update/:PatientIdAndMedicationId', auth(roles.OnlyUser), medicationCtrl.deleteMedicationByIDAndUpdateStateForThePrevious)
api.put('/medication/newdose/:medicationIdAndPatient', auth(roles.OnlyUser), medicationCtrl.newDose)
api.put('/medication/stoptaking/:medicationId', auth(roles.OnlyUser), medicationCtrl.stoptaking)
api.put('/medication/changenotes/:medicationId', auth(roles.OnlyUser), medicationCtrl.changenotes)
api.put('/medication/sideeffect/:medicationId', auth(roles.OnlyUser), medicationCtrl.sideeffect)

// OTHER MEDICATION routes, using the controller socialinfo, this controller has methods
api.get('/othermedication/:patientId', auth(roles.UserResearcher), othermedicationCtrl.getMedications)
api.get('/othermedicationID/:medicationId', auth(roles.UserResearcher), othermedicationCtrl.getMedicationsId)
api.get('/othermedicationName/:patientIdAndMedicationName', auth(roles.UserResearcher), othermedicationCtrl.getMedicationName)
api.post('/othermedication/:patientId', auth(roles.OnlyUser), othermedicationCtrl.saveMedication)
api.put('/othermedication/:medicationId', auth(roles.OnlyUser), othermedicationCtrl.updateMedication)
api.delete('/othermedication/:medicationId', auth(roles.OnlyUser), othermedicationCtrl.deleteMedication)
api.delete('/othermedication/update/:PatientIdAndMedicationId', auth(roles.OnlyUser), othermedicationCtrl.deleteMedicationByIDAndUpdateStateForThePrevious)

// heighteinfo routes, using the controller socialinfo, this controller has methods
api.get('/vaccinations/:patientId', auth(roles.UserResearcher), vaccinationCtrl.getVaccinations)
api.post('/vaccination/:patientId', auth(roles.OnlyUser), vaccinationCtrl.saveVaccination)
api.delete('/vaccination/:vaccinationId', auth(roles.OnlyUser), vaccinationCtrl.deleteVaccination)

// heighteinfo routes, using the controller socialinfo, this controller has methods
api.get('/medicalcare/:patientId', auth(roles.UserResearcher), medicalcareCtrl.getMedicalCare)
api.post('/medicalcare/:patientId', auth(roles.OnlyUser), medicalcareCtrl.saveMedicalCare)

// clinicalTrial routes, using the controller clinicalTrial, this controller has methods
api.get('/clinicaltrial/:patientId', auth(roles.UserResearcher), clinicalTrialCtrl.getClinicalTrial)
api.post('/clinicaltrial/:patientId', auth(roles.OnlyUser), clinicalTrialCtrl.saveClinicalTrial)
api.put('/clinicaltrial/:clinicalTrialId', auth(roles.OnlyUser), clinicalTrialCtrl.updateClinicalTrial)
api.delete('/clinicaltrial/:clinicalTrialId', auth(roles.OnlyUser), clinicalTrialCtrl.deleteClinicalTrial)

// phenotypeinfo routes, using the controller socialinfo, this controller has methods
api.get('/phenotypes/:patientId', auth(roles.UserResearcher), phenotypeCtrl.getPhenotype)
api.post('/phenotypes/:patientId', auth(roles.OnlyUser), phenotypeCtrl.savePhenotype)
api.put('/phenotypes/:phenotypeId', auth(roles.OnlyUser), phenotypeCtrl.updatePhenotype)
api.delete('/phenotypes/:phenotypeId', auth(roles.OnlyUser), phenotypeCtrl.deletePhenotype)//de momento no se usa
api.get('/phenotypes/history/:patientId', auth(roles.UserResearcher), phenotypeCtrl.getPhenotypeHistory)
api.delete('/phenotypes/history/:phenotypeId', auth(roles.OnlyUser), phenotypeCtrl.deletePhenotypeHistoryRecord)

// genotype routes, using the controller socialinfo, this controller has methods
api.get('/genotypes/:patientId', auth(roles.UserResearcher), genotypeCtrl.getGenotype)
api.post('/genotypes/:patientId', auth(roles.OnlyUser), genotypeCtrl.saveGenotype)
api.put('/genotypes/:genotypeId', auth(roles.OnlyUser), genotypeCtrl.updateGenotype)
api.delete('/genotypes/:genotypeId', auth(roles.OnlyUser), genotypeCtrl.deleteGenotype)//de momento no se usa

//admin routes fpr langs, using the controllers of folder Admin, this controller has methods

//admin routes fpr langs, using the controllers of folder Admin, this controller has methods
api.get('/admin/users/:groupName', auth(roles.Readers), admninUsersCtrl.getUsers)
api.get('/admin/subscribeUsers/:groupName', auth(roles.Admin), admninUsersCtrl.getSubscribeUsers)
api.put('/admin/patients/:patientId', auth(roles.Admin), admninUsersCtrl.setDeadPatient)
api.put('/admin/users/subgroup/:userId', auth(roles.Admin), admninUsersCtrl.setSubgroupUser)
api.put('/admin/users/state/:userId', auth(roles.Admin), admninUsersCtrl.setStateUser)

api.get('/admin/stats/:groupNameAndGroupIdAndLang', auth(roles.Admin), admninStatsCtrl.getUsers)
api.get('/admin/stats/translateCoDSections/:groupIdAndLangAndListSections',auth(roles.Admin),admninStatsCtrl.translateCoDSectionsStats)

api.post('/admin/answers/getanswer', auth(roles.UserResearcher), admninAnswersCtrl.getAnswers)
api.post('/admin/answers/setanswers', auth(roles.OnlyUser), admninAnswersCtrl.setAnswers)

api.post('/admin/lang/:userId', auth(roles.Admin), admninLangCtrl.requestLangFile)
api.put('/admin/lang/:userId', auth(roles.Admin), admninLangCtrl.requestaddlang)

api.get('/admin/getPatientsForUserList/:userIdList', auth(roles.Admin), admninUsersCtrl.getPatientListForListOfUserIds)
api.get('/admin/getPatientsForOrganization/:subgroup', auth(roles.Admin), admninUsersCtrl.getPatientListForOrganization)

//qna
api.get('/qna', auth(roles.UserResearcher), admninQnaCtrl.getKnowledgeBaseID)
api.get('/qnas', auth(roles.AdminSuperAdmin), admninQnaCtrl.getKnowledgeBaseIDS)
api.post('/admin/qna/:userId', auth(roles.AdminSuperAdmin), admninQnaCtrl.createKnowledgeBase)
api.delete('/admin/qna/:userIdAndknowledgeBaseID', auth(roles.AdminSuperAdmin), admninQnaCtrl.deleteKnowledgeBase)
api.post('/admin/qna/setCategories/:groupNameAndLang', auth(roles.AdminSuperAdmin), admninQnaCtrl.addCategories)
api.get('/admin/qna/getCategories/:knowledgeBaseID', auth(roles.AdminSuperAdmin), admninQnaCtrl.getCategories)
api.delete('/admin/qna/deleteCategory/:groupNameAndLang', auth(roles.AdminSuperAdmin), admninQnaCtrl.deleteCategory)



api.post('/superadmin/qna/:userId', auth(roles.SuperAdmin), superadmninQnaCtrl.createKnowledgeBase)
api.delete('/superadmin/qna/:userIdAndknowledgeBaseID', auth(roles.SuperAdmin), superadmninQnaCtrl.deleteKnowledgeBase)

//superadmin routes, using the controllers of folder Admin, this controller has methods
api.post('/superadmin/lang/:userId', auth(roles.SuperAdmin), superAdmninLangCtrl.updateLangFile)
api.put('/superadmin/lang/:userId', auth(roles.SuperAdmin), function(req, res){
  req.setTimeout(0) // no timeout
  superAdmninLangCtrl.addlang(req, res)
})
api.delete('/superadmin/lang/:userIdAndLang', auth(roles.SuperAdmin), superAdmninLangCtrl.deletelang)

// group routes, using the controller group, this controller has methods
api.get('/groupsnames', groupCtrl.getGroupsNames)
api.get('/groupadmin/:groupName', groupCtrl.getGroupAdmin)
api.get('/groups', groupCtrl.getGroups)
api.get('/group/:groupName', auth(roles.All), groupCtrl.getGroup)
api.post('/group/:userId', auth(roles.SuperAdmin), groupCtrl.saveGroup)
api.put('/group/:userId', auth(roles.SuperAdmin), groupCtrl.updateGroup)
api.delete('/group/:userIdAndgroupId', auth(roles.SuperAdmin), groupCtrl.deleteGroup)
api.get('/group/phenotype/:groupName', auth(roles.All), groupCtrl.getPhenotypeGroup)
api.put('/group/phenotype/:userId', auth(roles.SuperAdmin), groupCtrl.updatePhenotypeGroup)
api.get('/group/medications/:groupName', auth(roles.All), groupCtrl.getMedicationsGroup)
api.put('/group/medications/:userId', auth(roles.SuperAdmin), groupCtrl.updateMedicationsGroup)


// sections proms for each group
api.get('/group/sections/:groupId', auth(roles.SuperAdmin), sectionPromsCtrl.getSections)
api.get('/group/section/:promSectionId', auth(roles.SuperAdmin), sectionPromsCtrl.getSection)
api.post('/group/section/:groupId', auth(roles.SuperAdmin), sectionPromsCtrl.saveSection)
api.put('/group/section/:promSectionId', auth(roles.SuperAdmin), sectionPromsCtrl.updateSection)
api.delete('/group/section/:promSectionId', auth(roles.SuperAdmin), sectionPromsCtrl.deleteSection)

//proms for each section
api.get('/group/proms/:sectionId', promCtrl.getPromsSection)
api.get('/group/prom/:promId', promCtrl.getPromSection)
api.post('/group/prom/:userIdAndgroupId', auth(roles.SuperAdmin), promCtrl.savePromSection)
api.put('/group/prom/:userId', auth(roles.SuperAdmin), promCtrl.updatePromSection)
api.delete('/group/prom/:userIdAndpromId', auth(roles.SuperAdmin), promCtrl.deletePromSection)
api.post('/group/annotations/:userId', auth(roles.SuperAdmin), promCtrl.batchImportPromAnnotations)

//proms for each section
api.get('/proms', patientPromCtrl.getDataPromsSection)
api.post('/proms/:patientId', auth(roles.OnlyUser), patientPromCtrl.saveProms)
api.get('/prom/:promId', patientPromCtrl.getPromSection)
api.get('/promshistory', auth(roles.UserResearcher),patientPromCtrl.getPromHistory)

//promsStructure
api.get('/structureproms/:langAndgroupId', auth(roles.SuperAdmin), structurePromCtrl.getPromsStructure)
api.get('/translationstructureproms/:langAndgroupId', auth(roles.All), structurePromCtrl.getTranslationPromsStructure)
api.post('/structureproms', auth(roles.SuperAdmin), structurePromCtrl.savePromsStructure)
api.put('/structureproms/:promId', auth(roles.SuperAdmin), structurePromCtrl.updatePromsStructure)

// lang routes, using the controller lang, this controller has methods
api.get('/langs/',  langCtrl.getLangs)

// seizuresCtrl routes, using the controller seizures, this controller has methods
api.get('/seizures/:patientId', auth(roles.UserResearcher), seizuresCtrl.getSeizures)
api.post('/seizures/:patientId', auth(roles.OnlyUser), seizuresCtrl.saveSeizure)
api.put('/seizures/:seizureId', auth(roles.OnlyUser), seizuresCtrl.updateSeizure)
api.delete('/seizures/:seizureId', auth(roles.OnlyUser), seizuresCtrl.deleteSeizure)
api.post('/massiveseizures/:patientId', auth(roles.OnlyUser), seizuresCtrl.saveMassiveSeizure)

//Support
api.post('/support/', auth(roles.AllLessResearcher), supportCtrl.sendMsgSupport)
api.get('/support/:userId', auth(roles.AllLessResearcher), supportCtrl.getUserMsgs)
api.put('/support/:supportId', auth(roles.AdminSuperAdmin), supportCtrl.updateMsg)
api.post('/support/all/:userId', auth(roles.AdminSuperAdmin), supportCtrl.getAllMsgs)

//Llamadas del bot
api.post('/bot/:groupId',auth(roles.OnlyUser),botQnaCntrl.sendAndSaveFeedback)
api.get('/bots/:groupId', auth(roles.Admin), botQnaCntrl.getBotInfo)
//api.get('/botsall/', botQnaCntrl.getBotInfoAll)
api.delete('/bots/:groupId', auth(roles.Admin), botQnaCntrl.deleteQuestion)
api.put('/bots/:botId', auth(roles.Admin), botQnaCntrl.updateBotData)

// Alerts
api.post('/alerts/updateTranslations/:alertId',auth(roles.Admin), alertsCtrl.updateAlertTranslations)
api.get('/alerts/:groupId',auth(roles.SuperAdmin), alertsCtrl.getAlertByGroup)
api.get('/alerts/createUserAlertsForPatient/:groupIdAndPatientId',auth(roles.OnlyUser), alertsCtrl.getAlertByGroupAndCreateUserAlertsForPatient)
api.get('/alerts/typeGroupFilterLang/:groupIdAndTypeAndLang',auth(roles.Admin), alertsCtrl.getAlertByGroupAndTypeWithLangFilter)
api.delete('/alerts/:groupId',auth(roles.AdminSuperAdmin), alertsCtrl.deleteAlertByGroup)
api.get('/alerts/alertId/:alertId',auth(roles.OnlyUser), alertsCtrl.getAlertById)
api.delete('/alerts/alertId/:alertId',auth(roles.OnlyUser), alertsCtrl.deleteAlertById)
api.post('/alerts/alertAndUserAlerts/selectedUser/:groupid',auth(roles.Admin), alertsCtrl.saveAlertAndUpdateUserAlertsForSelectedUsers)
api.post('/alerts/alertAndUserAlerts/organization/:groupIdAndpatientId',auth(roles.Admin), alertsCtrl.saveAlertAndUpdateUserAlertsForOrganization)
api.post('/alerts/alertAndUserAlerts/allUser/:groupId',auth(roles.AdminSuperAdmin), alertsCtrl.saveAlertAndUpdateUserAlertsBroadcast)
api.delete('/alerts/alertAndUserAlerts/:alertId',auth(roles.AdminSuperAdmin), alertsCtrl.deleteAlertByIdAndUpdateUserAlerts)
api.get('/alerts/patient/:patientId',auth(roles.OnlyUser), alertsCtrl.getPatientAlerts)
api.get('/alerts/patient/bot/notRead/:patientIdAndLang',auth(roles.OnlyUser), alertsCtrl.getPatientAlertsNotReadForBot)
api.get('/alerts/patient/checkDateForUserAlerts/:patientId',auth(roles.OnlyUser), alertsCtrl.checkDateAndUpdateForUseralerts)
api.get('/alerts/alertsNotRead/:patientIdAndLang',auth(roles.OnlyUser), alertsCtrl.getUserAlertsNotReadForPatientIdAndLang)
api.get('/alerts/alertsNotReadAndTranslatedName/:patientIdAndLang',auth(roles.OnlyUser), alertsCtrl.getAlertsNotReadAndTranslatedName)
api.get('/alerts/alertsReadAndTranslatedName/:patientIdAndLang',auth(roles.OnlyUser), alertsCtrl.getAlertsReadAndTranslatedName)



// PendingAlerts
api.post('/useralerts/:patientId',auth(roles.OnlyUser), useralertsCtrl.saveUserAlerts)
api.post('/useralerts/checkingReceiver/:patientId',auth(roles.OnlyUser), useralertsCtrl.saveUserAlertsCheckingAlertReceive)
api.get('/useralerts/:patientId',auth(roles.OnlyUser), useralertsCtrl.getUserAlerts)
api.get('/useralerts/alertId/:patientIdAndAlertId',auth(roles.OnlyUser), useralertsCtrl.getUserAlertsByAlertId)
api.get('/useralerts/useralertId/:useralertId',auth(roles.OnlyUser), useralertsCtrl.getUserAlertsById)
api.delete('/useralerts/alertId/:patientIdAndAlertId',auth(roles.OnlyUser), useralertsCtrl.deleteUserAlertsByAlertId)
api.delete('/useralerts/useralertId/:useralertId',auth(roles.OnlyUser), useralertsCtrl.deleteUserAlertsById)
api.post('/useralerts/updatetoReadSelectedUserAlerts/:patientId',auth(roles.OnlyUser), useralertsCtrl.changeStateToReadForSelectedUserAlertsForPatient)
api.post('/useralerts/updateToLaunch/:patientId',auth(roles.OnlyUser), useralertsCtrl.changeStateToLaunch)

//getsastoken
api.get('/getAzureBlobSasTokenWithContainer/:containerName',auth(roles.AllLessResearcher), f29azureserviceCtrl.getAzureBlobSasTokenWithContainer)
api.get('/getAzureBlobSasTokenRead/:containerName',auth(roles.All), f29azureserviceCtrl.getAzureBlobSasTokenRead)

//gateway
api.post('/gateway/search/symptoms/', f29gatewayCtrl.searchSymptoms)

//ruta privada
api.get('/private', auth(roles.AllLessResearcher), (req, res) => {
	res.status(200).send({ message: 'You have access' })
})

module.exports = api
