/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 May 2014     vpant
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function workflowAction_enterRejectReason()
{
	var stLoggerTitle = 'workflowAction_enterRejectReason';
		
	nlapiLogExecution('DEBUG', stLoggerTitle, '>>Entry<<');
    
    try
    {    	
    	var stTranId = nlapiGetRecordId();
    	nlapiLogExecution('DEBUG', stLoggerTitle, 'Transaction ID = ' + stTranId);

    	var stTranType = nlapiGetRecordType();
    	nlapiLogExecution('DEBUG', stLoggerTitle, 'Transaction Type = ' + stTranType);
    	
    	var arrParams = new Array();
		arrParams['custpage_tranid']=stTranId;
		arrParams['custpage_trantype']=stTranType;
    	
		nlapiSetRedirectURL('SUITELET','customscript_nd_rej_reason_sui','customdeploy_nd_rejectionreason', null, arrParams);
		//nlapiSetRedirectURL('SUITELET','customscript_mys_upd_jnl_rej_rsn','customdeploy_mys_upd_jnl_rej_rsn', null, arrParams);
        
        nlapiLogExecution('DEBUG', stLoggerTitle, '>>Exit<<');        
        return true;
    } 
    catch (error)
    {
    	if (error.getDetails != undefined)
        {
            nlapiLogExecution('ERROR','Process Error',  error.getCode() + ': ' + error.getDetails());
            throw error;
        }
        else
        {
            nlapiLogExecution('ERROR','Unexpected Error', error.toString()); 
            throw nlapiCreateError('99999', error.toString());
        }    	 
        return false;
    }    
}


/**
 * A main suitelet that will display the Reject Reason page
 * @param request
 * @param response
 */
function suitelet_updateRejectReason(request,response)
{	
	var stLoggerTitle = 'suitelet_updateRejectReason';		
	nlapiLogExecution('DEBUG', stLoggerTitle, '>> Entry Log <<');
    
    try
    {    	
		var stStage = request.getParameter('custpage_stage');
		nlapiLogExecution('DEBUG', stLoggerTitle, 'Stage = ' + stStage);
		
		var stTranId = request.getParameter('custpage_tranid');
		nlapiLogExecution('DEBUG', stLoggerTitle, 'Transaction ID = ' + stTranId);

		var stTranType = request.getParameter('custpage_trantype');
		nlapiLogExecution('DEBUG', stLoggerTitle, 'Transaction Type = ' + stTranType);
		
    	var form = nlapiCreateForm('Rejection Reason', true);
    	
    	switch(stStage)
        {
        	case 'showRejectReasonPage':
        		form = updateRejectReason(request,response, form, stTranId, stTranType);
        		break;
        	default:
        		form = showRejectReasonPage(request,response, form, stTranId, stTranType);    	 
        }   	
    } 
    catch (error)
    {
    	if (error.getDetails != undefined)
        {
            nlapiLogExecution('ERROR','Process Error',  error.getCode() + ': ' + error.getDetails());
            throw error;
        }
        else
        {
            nlapiLogExecution('ERROR','Unexpected Error', error.toString()); 
            throw nlapiCreateError('99999', error.toString());
        }
    }    
}


/**
 * Display Reject Reason page
 * @param request
 * @param response
 * @param form
 * @param stTranId 
 */
function showRejectReasonPage(request, response, form, stTranId, stTranType)
{
	form = nlapiCreateForm('Rejection Reason', true);
	
	var fldStage = form.addField('custpage_stage', 'text', 'Stage');
	fldStage.setDefaultValue('showRejectReasonPage');
	fldStage.setDisplayType('hidden');
	
	var fldTranId = form.addField('custpage_tranid', 'text', 'Transaction ID');
	fldTranId.setDefaultValue(stTranId);
	fldTranId.setDisplayType('hidden');
	
	var fldTranType = form.addField('custpage_trantype', 'text', 'Transaction Type');
	fldTranType.setDefaultValue(stTranType);
	fldTranType.setDisplayType('hidden');

	// Create the following fields: Reject Reason, Reject Reason Details
	//form.addField('custpage_reject_reason', 'select', 'Rejection Reason', '176').setMandatory(true); // SB
	//form.addField('custpage_reject_reason', 'select', 'Rejection Reason', '411').setMandatory(true); // UAT
	form.addField('custpage_reject_reason_details', 'textarea', 'Rejection Reason Details').setMandatory(true);
	
	// Create the following buttons: Save, Cancel
	form.addSubmitButton('Save');
	
	response.writePage(form);
}


/**
 * If the user clicks Save, the page will be redirected back to the Access Request record and the status is changed to Rejected.
 * @param request
 * @param response
 * @param form
 * @param stTranId
 */
function updateRejectReason(request, response, form, stTranId, stTranType)
{
	var stLoggerTitle = 'suitelet_updateRejectReason - rejected';	
	nlapiLogExecution('DEBUG', stLoggerTitle, 'Transaction ID = ' + stTranId + ' | Transaction Type = ' + stTranType);
	
	//var stRejectReason = request.getParameter('custpage_reject_reason');
	//nlapiLogExecution('DEBUG', stLoggerTitle, 'Rejection Reason = ' + stRejectReason);
	
	var stRejectReasonDetails = request.getParameter('custpage_reject_reason_details');
	nlapiLogExecution('DEBUG', stLoggerTitle, 'Rejection Reason Details = ' + stRejectReasonDetails);

	nlapiSubmitField(stTranType, stTranId, ['custrecord_newdeal_rejectionreason','custrecord_newdeal_approvalstatus'], 
			[stRejectReasonDetails,'5']);
	nlapiLogExecution('DEBUG', stLoggerTitle, 'Successfully updated record.');
	
	nlapiSetRedirectURL('RECORD', stTranType, stTranId);
	
	
}