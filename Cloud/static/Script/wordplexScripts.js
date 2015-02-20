function showIp(divIn, objIn)
{
	$(divIn).empty();
	$(divIn).append(objIn.ip);
	
}

function preGame(divIn, objIn)
{
	var word = objIn.data;
	$(divIn).empty();
	var out = ("<form id = 'view' class='form-blue'>\
		<div class='title'>\
			<h2>The Word is <span style = 'color:#000; font-size: 1.25em;'>"+word+"</h2>\
		</div>\
		<div id = 'view' class='element-text'>\
			<div class='item-cont'><input id = 'word1' class='large' type='text' name='first_word' placeholder='First Word'  required = 'true'/><span class='icon-place'  ></span></div>\
			<div class='item-cot'><label id = 'error1' class='myerror' value = '' style = 'visibility:hidden'></label></div>\
			<div class='item-cont'><input id = 'word2' class='large' type='text' name='second_word' placeholder='Second Word' value = ''  required = 'true'/><span class='icon-place' ></span></div>\
			<div class='item-cot'><label id = 'error2' class='myerror' value = '' value = 'x' style = 'visibility:hidden'></label></div>\
			<div class='item-cont'><input id = 'word3' class='large' type='text' name='third_word' placeholder='Third Word' required = 'true'/><span class='icon-place'  ></span></div>\
			<div class='item-cot'><label id = 'error3' class='myerror' value = '' style = 'visibility:hidden'></label></div>\
			<div class='item-cont'><input id = 'word4' class='large' type='text' name='fourth_word' placeholder='Fourth Word'  required = 'true'/><span class='icon-place' ></span></div>\
			<div class='item-cot'><label id = 'error4' class='myerror' value = '' style = 'visibility:hidden'></label></div>\
			<div class='item-cont'><input id = 'word5' class='large' type='text' name='fifth_word' placeholder='Fifth Word' required = 'true'/><span class='icon-place'  ></span></div>\
			<div class='item-cot'><label id = 'error5' class='myerror' value = '' style = 'visibility:hidden'></label></div>\
			<div class='item-cont'><input id = 'word6' class='large' type='text' name='sixth_word' placeholder='Sixth Word'  required = 'true'/><span class='icon-place' ></span></div>\
			<div class='item-cot'><label id = 'error6' class='myerror' value = '' style = 'visibility:hidden'></label></div>\
			<div class='item-cont'><input id = 'word7' class='large' type='text' name='seventh_word' placeholder='Seventh Word' required = 'true'/><span class='icon-place'  ></span></div>\
			<div class='item-cot'><label id = 'error7' class='myerror' value = '' style = 'visibility:hidden'></label></div>\
			</div>\
		<div class='submit'>\
			<input id = 'winner_form_submit' type='submit' value='Submit'/>\
		</div>\
	</form>");

	
	$(divIn).append(out);
	check = "False"
	$('#word1').focus();
	
	$( "#winner_form_submit" ).click(function() {
	
		var win = checkForm('input','label');
		if(win)
		{
			$.ajax({
				url: '/winner',
				type: 'POST',
				success: function(response) 
				{
					setWinnerForm('#view', response);
				},
				error: function(error) 
				{
					alert('Submiting Winner'+Error);
				}
			});
		}

	});

	
	 $( ".large" ).each(function( index, element ) {
		// element == this
		$(this).focusout(function(){
			
			var next = $(this).parent().next().children();
			var prev = $(this).parent().prev().children();
			var word = $(this).val();
			var here = $(this);
			var data = {'word' : word};
			
			$(function() {
				$.ajax({
					type: "GET",
					url: "/check_the_word",
					contentType: "application/json; charset=utf-8",
					data: { echoValue: word },
					success: function(data) {
					if(data.value != 'x')
						{
							next.text(data.value);
							next.css('visibility', 'visible');
						}
						else
						{
							next.css('visibility', 'hidden');
							next.val("");
							next.text("");
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert('chekTheWord'+errorThrown);
					}
				});
			});
		});
	});
	/*$('#wordtwo').focusout(function() {
		var check = "Fa"
		if(check = "False")
			{
				$('#error2').text( "focusout fired: " );
				$('#error2').css('visibility', 'visible');
				$('#word1').focus();
			}
		else
		{
			$('#error2').css('visibility', 'hidden');
			$('#word1').focus();
		}
			
	});	*/

	
}
function checkForm(divIn, secDivIn)
{
	var out = true;
	$(divIn).each(function( index, element ) {
		if( $(this).val() == "" )
			{
				out = false;
			}
	});
	
	$(secDivIn).each(function( index, element ) {
	alert($(this).css('visibility')+" "+index);
		if( $(this).css() == "visible" )
			{
				out = false;
				alert(out);
			}
	});
	
	return out;
}

function setWinnerForm(divIn, objIn)
{
	$(divIn).empty();
	var out = ("<form id = 'view' class='form-blue'>\
		<div class='title'>\
			<h2>Well Done"+objIn.fname+" you are a Winner!<span style = 'color:#000; font-size: 1.25em;'></h2>\
		</div>\
		    <div class='item-cont'>\
			<textarea class='medium' placeholder='Text Area' rows='5' cols='20' name='textarea'>asdfsad</textarea>\
			<span class='icon-place'></span>\
			</div>\
		</div>\
		<div class='submit'>\
			<input id = 'game_form_submit' type='button' value='Submit'/>\
		</div>\
	</form>");
	
	$(divIn).append(out);
}
function setScoreTable(divIn, objIn)
{
	$(divIn).empty();
	var out = ("\
		<div id='tableBody' class ='datagrid' value = '"+$(divIn).val()+"'>\
		<table id = 'tableContactsx'>\
		<thead>\
		<tr class = 'seperator'>\
			 <th class = 'seperator' colspan = '6' style=' background-color:#006699; border-color:#006699;'>High Scores</th>\
			 </tr>\
		</thead>\
			<thead>\
			  <tr>\
			  <th id = 'sortrank'>Rank</th>\
			  <th id = 'sortname'>Name</th>\
			  <th>Time</th>\
			  <th>Date</th>\
			  </tr>\
			</thead>\
			</table>\
			<div style='overflow-y:scroll; overflow-x:hidden; max-height:400px; width:auto;'>\
			<table table id = 'tableScore'>\
			<tbody>");
			
	for (var i in objIn.players) 
	{
	
		out +=("\
			  <tr>\
			  <td class = 'wrap'>" + objIn.players[i].rank + "</td>\
			  <td class = 'titleBlue' >" + objIn.players[i].fname + " " + objIn.players[i].sname + "</td>\
			  <td class = 'wrap'>" + objIn.players[i].time + "</td>\
			  <td class = 'titleBlue' >" + objIn.players[i].date + "</td>\
			  </tr>\
			 ");
	}
	
	out += ("</tbody>\
			</table>\
			</div>\
			</div>\
			");
		$(divIn).hide();
		$(divIn).append(out);
		$(divIn).fadeIn(0);
		
		setTableHover();
		//setTableSort('#tableContactsx');
		//$('#tableContactsx').tablesorter();
		  
		  //tableFormWork('#tableScore',2);
	
}

  function setTableHover()
  {
	$('#tableBody tbody tr:even').addClass('alt');
		$('#tableBody tbody tr').hover(function(){ 
		$(this).addClass('altHover'); 
		  }, function(){  
			$(this).removeClass('altHover');  
		  });
}



  function tableFormWork(table, pos){
    var $tables = $(table);
	var $tablex = "#"+$(table).attr('id')+"x";
	var head = $($tablex);//head is needed for .find() function
	var firstCol = 1;
	
  
  $tables.each(function () {
	var _table = $(this);
  
	head.find('thead tr').not('.seperator').append($('<th class="edit"><span class="validate">Verify All</span><input class="verifyCheck" type="checkbox" /></th>'));
	_table.find('thead tr').not('.seperator').append($('<th class="edit">3 </th>'));
	_table.find('thead tr').not('.seperator').append($('<th class="edit">4 </th>'));
    
	_table.find('tbody tr').not('.seperator').append($('<td class="edit"><img class = "btnV"   src="Images\\verifyBlue60.png" data = "true"/><img class = "btnE"  src="Images\\editBlue60.png" /></td>'));
	_table.find('tr.seperator').append($('<th class="seperator" style=" background-color:#006699; border-color:#006699;"></th>'));

	head.find('tr.seperator').append($('<th class="seperator" style=" background-color:#006699; border-color:#006699;"></th>'));
  });
  
  // make table long in width
  var divTableWidth = $('.divTable').width();
  var datagridWidth = $('#tableBody').width();
  var excess = divTableWidth - datagridWidth;

  $(table).find('tbody tr td:nth-child('+pos+')').css('width', excess+'px');
   
  head.find( 'th').not('th.seperator').each(function () {
	
		var w = $(table).find("tbody tr td:nth-child("+firstCol+")").width();
		$(this).css('width', w);
		firstCol ++;
		
  });

  
 
  
  $tables.find('.edit .btnE').live('click', function(e) {
	tableVerify(this);
    tableEditable(this);
    e.preventDefault();
  });
  
  $tables.find('.edit .btnV').live('click', function(e) {
    tableVerify(this);
    e.preventDefault();
  });
  
  $('.verifyCheck').change(function(e) {
  
    if(this.checked)
	{
		tableVerifyAll(table);
	}
	else
	{
		tableVerifyNone(table);
	}
    e.preventDefault();
  });
  
  $tables.css('overflow-y', 'scroll');
  }
  

  