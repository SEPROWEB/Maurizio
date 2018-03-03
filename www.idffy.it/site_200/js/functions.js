/* Version 1.03 */
function AJ_open_url( AJ_url, AJ_target )
{  
var AJ_response = '' ;
var status_report = '' ;
new Ajax.Request( AJ_url,
                  {
                   method:       'get',
                   asynchronous: false,
                   onSuccess: function( transport )
                      {
                       AJ_response = transport.responseText ;
                       
                        // Scrittura della risposta
                       if ( AJ_target == 'no_target' )
                          {
                            // Viene solo chiamata la pag remota
                            status_report = 3 ;
                          }
                       else if ( AJ_target == 'process_json_response' )
                          {
                           // Viene solo eseguita la pag remota con alert
                           // Mappatura dei codici di ritorno
                           //  1  => Identificato errore nel parsing Json
                           //  2  => Identificato errore nella risposta
                           // >10 => Risposte dal processamento della pag eseguita
                           
                           status_report = AJ_response_parser( AJ_response, '', 1 ) ;
                          }
                       else if ( AJ_target == 'process_json_response_no_dialog' )
                          {
                           // Viene solo eseguita la pag remota senza alert
                           // Mappatura dei codici di ritorno
                           //  1  => Identificato errore nel parsing Json
                           //  2  => Identificato errore nella risposta
                           // >10 => Risposte dal processamento della pag eseguita
                           
                           status_report = AJ_response_parser( AJ_response, '', 0 ) ;
                          }
                       else if ( AJ_target == 'process_json_response_code_return' )
                          {
                           // Viene solo eseguita la pag remota senza alert
                           // e prelevato il codice di risposta
                           
                           status_report = AJ_response_parser( AJ_response, 'code_string', 0 ) ;
                          }
                       else
                          {
                           // Viene scritto il risultato nel div indicato
                           $( AJ_target ).innerHTML = AJ_response ;
                           status_report = 3 ;
                          }
                      }
                  } ) ;

return status_report ;
}

function AJ_post_url( AJ_url, AJ_form_name, AJ_target )
{
if ( AJ_url                  == '' ||
     AJ_form_name            == '' ||
     AJ_target               == '' )
   {
    alert( 'System error in function, missing parameters ...' ) ;
    exit ;
   }

//Serializzazione dei dati della form
var AJSerializedData = $( AJ_form_name ).serialize() ;
var AJ_response      = '' ;
var status_report    = '' ;
new Ajax.Request( AJ_url,
                  {
                   method:       'post',
                   asynchronous: false,
                   parameters:   AJSerializedData,
                   encoding:     'UTF-8',
                   onSuccess: function( transport )
                      {
                       AJ_response = transport.responseText ;
                       
                       // Scrittura della risposta
                       if ( AJ_target == 'no_target' )
                          {
                           // Viene solo eseguita la pag remota
                           status_report = 3 ;
                          }
                       else if ( AJ_target == 'process_json_response' )
                          {
                           // Viene solo eseguita la pag remota
                           // Mappatura dei codici di ritorno
                           //  1  => Identificato errore nel parsing Json
                           //  2  => Identificato errore nella risposta
                           // >10 => Risposte dal processamento della pag eseguita
                           //alert( AJ_response ) ;
                           status_report = AJ_response_parser( AJ_response, '', 1 ) ;
                          }
                       else if ( AJ_target == 'process_json_response_no_dialog' )
                          {
                           // Viene solo eseguita la pag remota
                           // Mappatura dei codici di ritorno
                           //  1  => Identificato errore nel parsing Json
                           //  2  => Identificato errore nella risposta
                           // >10 => Risposte dal processamento della pag eseguita
                           //alert( AJ_response ) ;
                           status_report = AJ_response_parser( AJ_response, '', 0 ) ;
                          }
                       else
                          {
                           // Viene scritto il risultato nel div indicato
                           $( AJ_target ).innerHTML = AJ_response ;
                           status_report = 3 ;
                          }
                      }
                  } ) ;

return status_report ;
}

function AJ_response_parser( AJ_response_string, AJ_return_obj_name, AJ_show_dialog )
{
// Mappatura dei codici di ritorno
// 1=> Identificato errore nel parsing Json
// 2=> Identificato errore nella risposta

if ( AJ_return_obj_name == 'code_string' )
   {
    if ( AJ_response_string.startsWith( '[code_string_response]' ) && AJ_response_string.endsWith( '[end-code_string_response]' ) )
       {
        AJ_response_string = AJ_response_string.sub( /\[code_string_response\]/, '' ) ;
        AJ_response_string = AJ_response_string.sub( /\[end-code_string_response\]/, '' ) ;
        return AJ_response_string ;
       }
    else
       {
        //alert( 'Malformed response ...\n----------------' + AJ_response_string  ) ;
		alert( 'Malformed response ... Http Connection Problems' ) ;
        return 2 ;
       }
   }


if ( AJ_response_string.startsWith( '[response]' ) && AJ_response_string.endsWith( '[end-response]' ) )
   {
    AJ_response_string = AJ_response_string.sub( /\[response\]/, '' ) ;
    AJ_response_string = AJ_response_string.sub( /\[end-response\]/, '' ) ;

    if ( AJ_response_string.isJSON() )
       {
        Jsonresp = AJ_response_string.evalJSON() ;

        //var Text  = Jsonresp.text ;
        //Text  = 'Response :\n\n' + Jsonresp.text + '\n\n' ;
        
        //Text =  Text + '------------------------------------------------------------\n' ;
        //Text =  Text + 'func   : ' + Jsonresp.func + '\n' ;
        //Text =  Text + 'status : ' + Jsonresp.status + '\n' ;
        //Text =  Text + 'code   : ' + Jsonresp.code + '\n' ;
        //Text =  Text + '------------------------------------------------------------\n' ;

        var Text  = Jsonresp.text + '\n\nCCode : ' + Jsonresp.code ;

        if ( AJ_show_dialog == 1 ) { alert( Text ) ; }

        if ( Jsonresp.status == 'error' )
           {
            return Jsonresp.code ;
           }
        else
           {
            return Jsonresp.code ;
           }
       }
    else
       {
        alert( 'Unknown JSON response ... ' ) ;
        return 1 ;
       }
   }
else
   {
    //alert( 'Malformed response ...\n----------------' + AJ_response_string  ) ;
	alert( 'Malformed response ... Http Connection Problems' ) ;
    return 2 ;
   }
}

