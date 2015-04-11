var intervalId;
var fadeTime = 500;
var patientFiles = "";
getPatientFiles();
//alert(patientFiles );
function setPatientTable(divIn,patientList,patientFiles)
{
	var dropDown = "";
	//create File drop down from list
	dropDown += ("<select id='unitlive' onChange='onFileSelectChange(this);'><option value = 'null'> Choose File </option>");
	for (var i in patientList) 
	{
		for(var j in patientFiles)
		{
		dropDown +=("<option value="+ patientList[i].patient_id+">"+ patientList[i].last_name+" "+ patientList[i].first_name+"</option>");
		}
		
	}
	dropDown += ("</select>");

	$(divIn).empty();
	var out = ("\
		<div id='tableBody' class ='datagrid' value = '"+$(divIn).val()+"'>\
		<table id = 'tablePatientsx'>\
		<thead>\
		<tr id = 'seperatortr' class = 'seperator'>\
			 <th class = 'seperator' colspan = '5' style='  color:#ffffff;'>Patients</th>\
			 </tr>\
		</thead>\
			<thead id = 'seperatorth'>\
			  <tr>\
			  <th>Reference</th>\
			  <th>First Name</th>\
			  <th>Last Name</th>\
			  <th>Insert Date</th>\
			  <th>Patient FIles</th>\
			  </tr>\
			</thead>\
			</table>\
			<div style='overflow-y:scroll; overflow-x:hidden; max-height:400px; width:auto;'>\
			<table id = 'tablePatients'>\
			<tbody>");
			
			out +=("\
			  <tr>\
			  <td class = 'wrap'></td>\
			  <td class = 'wrap'></td>\
			  <td class = 'wrap'></td>\
			  <td  class = 'titleBlue' ></td>\
			  <td  class = 'titleBlue' style = 'width:auto;' ></td>\
			  </tr>\
			 ");
			 
	for (var i in patientList) 
	{
	
		var dropDown = "";
		dropDown += ("<select id='"+patientList[i].patient_id+"' onChange='onFileSelectChange(this);'> <option value = 'null'> Choose File </option>");
		for(var j in patientFiles)
		{
			if(patientList[i].patient_id == patientFiles[j].patient_id)
			{
				dropDown +=("<option value="+ patientFiles[j].patient_file_id+">Id: "+ patientFiles[j].patient_file_id+" "+ patientFiles[j].save_date+"</option>");
			}
		}
		dropDown += ("</select>");
		
		out +=("\
			  <tr id = '"+patientList[i].patient_id+ "'>\
			  <td  class = 'wrap' >" + patientList[i].patient_reference+ "</td>\
			  <td class = 'wrap'>" + patientList[i].first_name+"</td>\
			  <td class = 'wrap' >" + patientList[i].last_name+"</td>\
			  <td  class = 'titleBlue' >" + patientList[i].create_date+ "</td>\
			  <td  class = 'titleBlue' style = 'width:auto;' >"+dropDown+"</td>\
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
		$(divIn).fadeIn(fadeTime);
		
		setTableHover();
		  
		  tableFormWork('#tablePatients',4);
	
}

function tableFormWork(table, pos)
{
    var $tables = $(table);
	var $tablex = "#"+$(table).attr('id')+"x";
	var head = $($tablex);//head is needed for .find() function
	var firstCol = 1;
	
  
  $(table).each(function () 
  {
	var table = $(this);
  
	head.find('thead tr').not('.seperator').append($('<th class="edit"><span class="validate">Options</span></th>'));
	table.find('thead tr').not('.seperator').append($('<th class="edit">3 </th>'));
	table.find('thead tr').not('.seperator').append($('<th class="edit">4 </th>'));
    table.find('tbody tr:first').not('.seperator').append($('<td class="edit"><img id = "add" class = "btnE" src="../static/Images/addGreen.png" data = "true"/><img class = "btnV"  src="../static/Images/empty.png" /></td>'));
	table.find('tbody tr').not('tbody tr:first').not('.seperator').append($('<td class="edit"><img id = "edit" class = "btnE"   src="../static/Images/editGreen60.png" data = "true"/><img class = "btnD"  src="../static/Images/deleteRed.png" /></td>'));
	table.find('tr.seperator').append($('<th class="seperator" style=" background-color:#006699; border-color:#006699;"></th>'));

	head.find('tr.seperator').append($('<th class="seperator" style=" border-color:rgba(0,97,191,0.4);"></th>'));
  });
  
  // make table long in width
  var divTableWidth = $('.divTable').width();
  var datagridWidth = $('#tableBody').width();
  var excess = divTableWidth - datagridWidth;

  $(table).find('tbody tr td:nth-child('+pos+')').css('width', excess+'px');
   
  head.find( 'th').not('th.seperator').each(function () 
  {
	var w = $(table).find("tbody tr td:nth-child("+firstCol+")").width();
	$(this).css('width', w);
	firstCol ++;
		
  });

  $(table).find('.edit .btnE').live('click', function(e) 
  {
		tableEditable(this);
		e.preventDefault();
  });
  
  $(table).find('.edit .btnEtoSave').live('click', function(e) 
	{
		var input = [];
		var mess = [];
		var $button = $(this);
		var $row = $button.parents('tbody tr');
		var $cells = $row.children('td.wrap').not('.edit');
		tableEditable(this);
		
		if( $(this).attr('id') == 'add')
		{
			
			$cells.each(function () {
				var cell = $(this);
				input.push(cell.text());

			})
			
			js1 = new Object()
			js1.reference = input[0];
			js1.first_name = input[1];
			js1.last_name = input[2];
			mess.push(js1);
			var toCloud = JSON.stringify(js1);
			var r = confirm("Do you want to add "+input[1]+" "+input[2]+"to the patients file.?");
			if (r == true) 
			{		
				addToPatientTable(toCloud);

			}
			else
			{
				
			}	
			
		}
		
		if( $(this).attr('id') == 'edit')
		{
			 
			$cells.each(function () {
				var cell = $(this);
				input.push(cell.text());

			})
			input.push($row.attr('id'));
			
			js1 = new Object()
			js1.reference = input[0];
			js1.first_name = input[1];
			js1.last_name = input[2];
			js1.id = input[3];
			mess.push(js1);
			var toCloud = JSON.stringify(js1);
			var r = confirm("Do you want to edit "+input[1]+" "+input[2]+"in the patients file.?");
			if (r == true) 
			{	

				editPatientTable(toCloud);
			}
			else
			{
				
			}	
			
		}
		e.preventDefault();
	});
  
  $(table).find('.edit .btnEsaved').live('click', function(e) 
	{
		tableEditable(this);
		e.preventDefault();
	});
  
  $(table).find('.edit .btnV').live('click', function(e) 
	{
		tableVerify(this);
		e.preventDefault();
  });
	$(table).find('.edit .btnVx').live('click', function(e) 
	{
		tableVerify(this);
		e.preventDefault();
  });
    $(table).find('.edit .btnD').live('click', function(e) 
	{
		var input = [];
		var mess = [];
		var $button = $(this);
		var $row = $button.parents('tbody tr');
		var rowClass = $row.attr('class'); 
		$row .addClass('allRed');

		input.push($row.attr('id'));
			
		js1 = new Object()
		js1.id = input[0];
		mess.push(js1);
		var toCloud = JSON.stringify(js1);
			
		var r = confirm("Do you want to delete this Record?");
		if (r == true) 
			{
				deletePatientTable(toCloud);
			} 
			else 
			{
				$row .removeClass('allRed');
			}
		e.preventDefault();
  });
  
	$(table).find('.edit .btnDx').live('click', function(e) 
	{
		tableVerify(this);
		e.preventDefault();
  });
  
  $('.verifyCheck').change(function(e) 
  {
  
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
  
  $(table).css('overflow-y', 'scroll');
  }



function setUnitTable(divIn, unitList)
{

	var status = "green";
	var patientList = getPatientList();
	$(divIn).empty();
	var out = ("\
		<div id='tableBody' class ='datagrid' value = '"+$(divIn).val()+"'>\
		<table id = 'anytablex'>\
		<thead>\
		<tr id = 'seperatortr' class = 'seperator'>\
			 <th class = 'seperator' colspan = '4' style='color:#ffffff;'>Units</th>\
			 </tr>\
		</thead>\
			<thead id = 'seperatorth'>\
			  <tr>\
			  <th>Unit Type</th>\
			  <th>Unit Number</th>\
			  <th>Status</th>\
			  <th>Assign Patient</th>\
			  </tr>\
			</thead>\
			</table>\
			<div style='overflow-y:scroll; overflow-x:hidden; max-height:400px; width:auto;'>\
			<table id = 'anytable'>\
			<tbody>");
			
	for (var i in unitList) 
		{
			if(unitList[i].unit_online == 1){status = "green";}
			if(unitList[i].unit_online == 0){status = "red";}
			if(unitList[i].unit_record == 1){status = "amber";}
			out +=("\
				  <tr id = '"+unitList[i].unit_id+ "'>\
				  <td  class = 'wrap' >" + unitList[i].unit_type+ "</td>\
				  <td  class = 'wrap' >" + unitList[i].unit_number+ "</td>\
				  <td class = 'wrap'>" +status+"</td>\
				  <td  class = 'titleBlue' style = 'width:auto;' ></td>\
				  <td class = 'wrap'> </td>\
				  </tr>\
				 ");
		}
					
			out += ("</tbody>\
			</table>\
			</div>\
			</div>\
			<div id ='gif'><img id = 'anigif' src = ../static/Images/ani.png />\
			<p id ='bpm'>BPM = 0</p>\
			");
		$(divIn).hide();
		$(divIn).append(out);
		$(divIn).fadeIn(10);
		setTableHover();
		unitTableFormWork('#anytable',4, unitList, patientList);
	
}

function unitTableFormWork(table, pos, file, patientList)
{
	
    var $tables = $(table);
	var $tablex = "#"+$(table).attr('id')+"x";
	var head = $($tablex);//head is needed for .find() function
	var firstCol = 1;
	var dropDown = "";
	//create patient drop down from list
	dropDown += ("<select id='unitlive' onChange='onPatientSelectChange(this);'><option value = 'null'> Assign Patient </option>");
		for (var i in patientList) 
	{

		dropDown +=("<option value="+ patientList[i].patient_id+">"+ patientList[i].last_name+" "+ patientList[i].first_name+"</option>");
		
	}
	dropDown += ("</select>");

		$('#anytable tr').each(function() {
			var out = $(this).find("td").eq(2).html();
			if (out =='green')
			{
				$(this).find("td").eq(2).text("");
				$(this).find("td").eq(2).append($('<td class="unitstatus"><img class = "traffic"   src="../static/Images/online2.png" data = "green"/></td>'));
				$(this).find("td").eq(4).text("");
				$(this).find("td").eq(4).append($(dropDown));
				//$(this).find("td").eq(6).text("");
				$(this).find("td").eq(5).append($('<td class="unitcontrol"><img class = "btnP" src="../static/Images/play.png" data = "false"/><img class = "btnS"  src="../static/Images/stop.png" data = "false" /><img class = "btnR"  src="../static/Images/rec.png" data = "false" /></td>'));
			}
			if (out =='amber')
			{
				$(this).find("td").eq(2).text("");
				$(this).find("td").eq(2).append($('<td class="unitstatus"><img class = "traffic"   src="../static/Images/online-record2.png" data = "amber"/></td>'));
				for (var i in patientList)
				{
					for(var j in file)
					{
						
						if(patientList[i].patient_id == file[j].unit_allocated_to)
						{
							$(this).find("td").eq(4).text("");
							$(this).find("td").eq(4).append(patientList[i].last_name+" "+ patientList[i].first_name);
						}
						
					}
				}
				$(this).find("td").eq(5).text("");
				$(this).find("td").eq(5).append($('<td class="unitcontrol"><img class = "btnP" src="../static/Images/play.png" data = "false"/><img class = "btnS"  src="../static/Images/stop.png" data = "false" /><img class = "btnR"  src="../static/Images/rec.png" data = "false" /></td>'));
			}
			if (out =='red')
			{
				$(this).find("td").eq(2).text("");
				$(this).find("td").eq(2).append($('<td class="unitstatus"><img class = "traffic"   src="../static/Images/offline2.png" data = "red"/></td>'));
			}
		});
		  
  $(table).each(function () 
  {
	var table = $(this);
	
  
	head.find('thead tr').not('.seperator').append($('<th class="edit"><span class="validate">Options</span></th>'));
	table.find('thead tr').not('.seperator').append($('<th class="edit">3 </th>'));
	table.find('thead tr').not('.seperator').append($('<th class="edit">4 </th>'));
	table.find('thead tr').not('.seperator').append($('<th class="edit">4 </th>'));

	table.find('tr.seperator').append($('<th class="seperator" style=" border-color:#006699;"></th>'));

	head.find('tr.seperator').append($('<th class="seperator" style="  border-color:#1E90FF;"></th>'));
  });
  
  // make table long in width
  var divTableWidth = $('.divTable').width();
  var datagridWidth = $('#tableBody').width();
  var excess = divTableWidth - datagridWidth;

  $(table).find('tbody tr td:nth-child('+pos+')').css('width', excess+'px');
   
  head.find( 'th').not('th.seperator').each(function () 
  {
	var w = $(table).find("tbody tr td:nth-child("+firstCol+")").width();
	$(this).css('width', w);
	firstCol ++;
		
  });
  
  	$(table).find('.btnP').live('click', function(e) 
	{
		clearInterval(intervalId);
		var mess =[];
		var $button = $(this);
		var $cell = $button.parents('tbody tr td');
		var $row = $button.parents('tbody tr');
		var id = $row.attr('id');
		for(var i in file)
		{
			if (id == file[i].unit_id)
			{
				$('#gif').empty();
				out = "<img id = 'anigif' src = ../static/Images/anigif2.gif /><p id ='bpm'>Unit Number "+file[i].unit_number+"<br/>BPM = "+file[i].unit_beat+"</p>";
				$('#gif').append(out);
				js1 = new Object()
				js1.id = file[i].unit_id;
				mess.push(js1);
				var toCloud = JSON.stringify(js1);
				setPlay(toCloud);
	
			}
		}
		intervalId = setInterval(function() {
			repeat(id);
		}, 3000);

		
		e.preventDefault();
	});
	
	$(table).find('.btnR').live('click', function(e) 
	{

		var mess =[];
		var $button = $(this);
		var $cell = $button.parents('tbody tr td');
		var $row = $button.parents('tbody tr');
		var patient_id =  $row.find('>:first-child').attr('id');
		var id = $row.attr('id');
		if(isAllocated(id))
		{
			for(var i in file)
			{
				if (id == file[i].unit_id)
				{
				
					js1 = new Object()
					js1.id = file[i].unit_id;
					mess.push(js1);
					var toCloud = JSON.stringify(js1);
					setRecord(toCloud);
					for (var i in patientList) 
					{
						if(patientList[i].patient_id == patient_id)
						{
							$row.find("td").eq(4).text("");
							$row.find("td").eq(4).append(patientList[i].last_name+" "+ patientList[i].first_name);
						}
						
					}
		
				}
			}
		}
		else{alert("You must allocate Patient first!");}
		
		e.preventDefault();
	});
	
	$(table).find('.btnS').live('click', function(e) 
	{

		var mess =[];
		var $button = $(this);
		var $cell = $button.parents('tbody tr td');
		var $row = $button.parents('tbody tr');
		var id = $row.attr('id');
		for(var i in file)
		{
			if (id == file[i].unit_id)
			{
				js1 = new Object()
				js1.id = file[i].unit_id;
				mess.push(js1);
				var toCloud = JSON.stringify(js1);
				setStop(toCloud);
			}
		}
		
		e.preventDefault();
	});

  
  $(table).css('overflow-y', 'scroll');
  }

function setAnyTable(divIn,data,tablename)
{

	var count = Object.keys(data[0]).length


	$(divIn).empty();
	var out = ("\
		<div id='tableBody' class ='datagrid' value = '"+$(divIn).val()+"'>\
		<table id = 'anytablex'>\
		<thead>\
		<tr id = 'seperatortr'>\
			 <th  colspan = '"+count+"'>"+tablename+"</th>\
			 </tr>\
		</thead>\
			<thead id = 'seperatorth'>\
			  <tr >");
			  for(var i = 0; i < count; i++)
			  {
					var arr =  Object.keys(data[0]);
					var x = splitKey(arr[i]);
					out +=("<th id ='top"+i+"x'>"+x+"</th>");

			  }
			  out +=("\
			  </tr>\
			</thead>\
			</table>\
			<div style='overflow-y:scroll; overflow-x:hidden; max-height:400px; width:auto;'>\
			<table id = 'anytable'>\
			<tbody>");
			
			out +=("<tr class ='bottom'>");
				for(var i=0; i < data.length; i++)
				{
					var obj = data[i];
					out +=("<tr>");
						for(var key in obj)
						{
							var attrName = key;
							var attrValue = obj[key];
							out += ("<td  class = 'wrap'>" +attrValue+ "</td>");		
						}
					out +=("</tr>");	
				}
					
			out += ("</tbody>\
			</table>\
			</div>\
			</div>\
			");

		$(divIn).hide();
		$(divIn).append(out);
		$(divIn).fadeIn(fadeTime);
		$('.wrap').css('height', '25px');
		
		// Correct table header difference
		var topWidth = 0;
		var bottomWidth = 0;
		for(var i = 0; i < count; i++)
		{
			var domselect = "#top"+i+"x"
			bottomWidth = $('#anytable').find('tbody tr td:nth-child('+(i+1)+')').width();
			topWidth = $(domselect).width();
			if( topWidth < bottomWidth)
			{
				$(domselect).css('width', bottomWidth+"px");
			}
		}
		
		setTableHover();	
}

function anyTableFormWork(table, pos)
{
    var $tables = $(table);
	var $tablex = "#"+$(table).attr('id')+"x";
	var head = $($tablex);//head is needed for .find() function
	var firstCol = 1;

	// make table long in width
	var divTableWidth = $('.divTable').width();
	var datagridWidth = $('#tableBody').width();
	var excess = divTableWidth - datagridWidth;

	$(table).find('tbody tr td:last-child').css('width', excess+'px');
	if( $('.top').width() < $('.bottom').width())
		{
			$('.top').css('width', $('.bottom').css(width));
		}
	$(table).css('overflow-y', 'scroll');
	$('.wrap').css('height', '30px');
  }

function splitKey(s)
{
	var arr = s.split("_");
	var out = "";
	for(var i = 0; i < arr.length; i++)
	{
		var x = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
		out += x + " ";
	}
	return out;
}


function tableEditable(button) 
{
    var $button = $(button);
    var $row = $button.parents('tbody tr');
    var $cells = $row.children('td.wrap').not('.edit');
	var $nonEditCell = $row.children('td').not('td.wrap, .edit');
	
  
	  if($row.data('flag'))
	  { 
		$cells.each(function () {
			var cell = $(this);
			cell.html(cell.find('input').val());
	  })
		
		$row.data('flag',false);
		$button.val('Edit');
		$button.attr('class', 'btnEsaved');
		
	  } 
	  else
	  { // in table mode, move to edit mode 
		// cell methods
		$cells.each(function()
		{
		  var cell = $(this);
		  cell.data('text', cell.html()).html('');
		  
		  var $input = $('<input type="text" />')
			.val(cell.data('text'))
			.css({'direction':'ltr','font-size': '11px','font-weight': 'normal'})
			.width(cell.width() - 16);
			cell.append($input);
		 })
		
		$row.data('flag', true);
		$button.val('Save');
		$button.attr('class', 'btnEtoSave');
	  }
  }
  
  function tableDelete(button) 
  {
	var $button = $(button);
    var $row = $button.parents('tbody tr');
	$row .addClass('allRed');

        $row .fadeOut(1500, function(){
            $row.remove();
			});

  }
  
function tableVerify(button) 
{
  var count = 1;
    var $button = $(button);
    var $row = $button.parents('tbody tr');
	var $nonEditCell = $row.children('td').not('.wrap, .edit, .select');
		
	if($button.attr('data') == 'false')
	{
		$nonEditCell.each(function()
		{
			if($nonEditCell.attr('class') === 'titleRed'){$nonEditCell.css('color', 'red');}
			if($nonEditCell.attr('class') === 'titleAmber'){$nonEditCell.css('color', 'orange');}
			if($nonEditCell.attr('class') === 'titleBlue'){$nonEditCell.css('color', '#00557f');}
		});
		
		$button.attr('class', 'btnV');
		$button.attr('data','true');
	}
	else if($button.attr('data') == 'true')
	{
		$nonEditCell.css('color', 'green');
		$button.attr('class', 'btnVx');
		$button.attr('data','false');
	}
 }

function tableVerifyAll(tableIn)
{
	 var tableIn = $(tableIn);
	 $('.titleRed').each(function(){$(this).css('color', 'green')});
	 $('.titleAmber').each(function(){$(this).css('color', 'green')});
	 $('.titleBlue').each(function(){$(this).css('color', 'green')});
	 $('.btnV').each(function(){$(this).removeClass('btnV').addClass('btnVx'); $(this).attr('data','false');});
   }
   
function tableVerifyNone(tableIn)
{
	 var tableIn = $(tableIn);
	 $('.titleRed').each(function(){$(this).css('color', 'red')});
	 $('.titleAmber').each(function(){$(this).css('color', 'orange')});
	 $('.titleBlue').each(function(){$(this).css('color', '#00557f')});
	 $('.btnVx').each(function(){$(this).removeClass('btnVx').addClass('btnV'); $(this).attr('data','true');});

   }
  

  
function setBodyPos(divIn)
{
	
	var fixedTop = $('#fixedHead').offset().top;
	var bodyTop = $('#body').offset().top;
	var divInTop =$(divIn).offset().top;
	bodyOffset = divInTop -(fixedTop + bodyOffsetTop);
	var x = '-='+bodyOffset+'px'
	$('#body').animate({'margin-top': x });
}

function setTableHover()
{
	$('#tableBody tbody tr:even').addClass('alt');
	$('#tableBody tbody tr:odd').addClass('oddalt');
		$('#tableBody tbody tr').hover(function()
		{ 
			$(this).addClass('altHover'); 
		}, function()
		{  
			$(this).removeClass('altHover');  
		});
  }
  
//Needed to fix ie10 bug not rendering svg fully(ie chart)
function renderBugFix()
{
	$(window).resize();
	
  }
  
///////////////////////////////////////////Cloud Calls///////////////////////////////////////////

var globalId = 0;

function getPatientFiles()
{
	var datax = "";
	$(function() {
		$.ajax({
			type: "POST",
			async: false,
			url: '/getpatientfiles',
			data: { name: 'n/a'},
			success:function( response ) {
			patientFiles= $.parseJSON(response);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});

}
function getAdminOrgTable(divIn,tablename)
{
	UnitCheck == false;
	$(function() {

        $.ajax({
            url: '/adminorgtable',
            type: 'POST',
			data: 'json',
            success: function(response) {
                console.log(response);
				var data = $.parseJSON(response);
				setAnyTable(divIn,data,tablename);
            },
            error: function(error) {
                console.log(error);
            }
        });
   
	});
}
  
function getAdminSigTable(divIn,tablename)
{
	$(function() {

        $.ajax({
            url: '/adminsigtable',
            type: 'POST',
			data: 'json',
            success: function(response) {
				var data = $.parseJSON(response);
				setAnyTable(divIn,data,tablename);
            },
            error: function(error) {
                console.log(error);
            }
        });
   
	});
}
  
function addOrgSelection(divIn)
{	
	$(function() {

        $.ajax({
            url: '/organisationselect',
            type: 'POST',
			data: 'json',
            success: function(response) {
                console.log(response);
				var data = $.parseJSON(response);
				var out = ("\
					<div id = 'orgselect' class='login-card'>\
					<form>\
					<p><h3>Select Organisation for full unit functionality</h3></p>\
					<select id='developer' onChange='onOrgSelectChange(this);'>");
					for( i in data)
					{
						out += "<option value='"+data[i].Name+"'>"+data[i].Name+"</option>";

					}
				out+= "</select></form></div>";
				$(divIn).append(out);
				$('#orgselect').css('background-color', 'rgba(0,97,191,0.8)');
				$('#orgselect').css('color', '#E7E5E5');
				$('#orgselect').css('width', '200px');
				$('#orgselect').css('text-align', 'center');
				$('#orgselect').css('margin-top', '10px');

            },
            error: function(error) {
                console.log(error);
            }
        });
   
	});
}

function onOrgSelectChange(sel)
{

	$(function() {
		$.ajax({
			type: "POST",
			url: '/selectedadminunittable',
			data: { name: sel.value },
			success:function( response ) {
			var divIn = '#display';
			var tablename = ""+sel.value+" Unit live parameters";
			var datax = $.parseJSON(response);
				setAnyTable(divIn,datax,tablename);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});
}

function setPatientsTable(divIn)
{


	$(function() {
		$.ajax({
			type: "POST",
			url: '/getpatientstable',
			data: { name: 'n/a'},
			success:function( response ) {
			var datax = $.parseJSON(response);
				setPatientTable(divIn,datax,patientFiles);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});
}

function setUnitsTable(divIn)
{

		$(function() {
			$.ajax({
				type: "POST",
				url: '/getunitstable',
				data: { name: 'n/a'},
				success:function( response ) {
				var datax = $.parseJSON(response);
					setUnitTable(divIn,datax);
				},
				error: function(error) {
						console.log(error);
				}
			});
		});
		
}

function addToPatientTable(dataIn)
{
	$(function() {
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: '/addtopatientstable',
			data: dataIn,
			success:function( response ) {
			var datax = $.parseJSON(response);
				setPatientTable('#display',datax);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});
}

function editPatientTable(dataIn)
{
	$(function() {
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: '/editpatientstable',
			data: dataIn,
			success:function( response ) {
			var datax = $.parseJSON(response);
				setPatientTable('#display',datax);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});
}

function deletePatientTable(dataIn)
{
	$(function() {
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: '/deletepatients',
			data: dataIn,
			success:function( response ) {
			var datax = $.parseJSON(response);
				setPatientTable('#display',datax);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});
}

function getPatientList()
{
	var datax;
	$(function() {
		$.ajax({
			type: "POST",
			async: false,
			url: '/getpatientstable',
			data: { name: 'n/a'},
			success:function( response ) {
			datax= $.parseJSON(response);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});
	return datax;
}

function setPlay(dataIn)
{
	var datax;
	$(function() {
		$.ajax({
			type: "POST",
			url: '/playpressed',
			contentType: 'application/json',
			data: dataIn,
			success:function( response ) {
			datax= $.parseJSON(response);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});

}

function setRecord(dataIn)
{

	$(function() {
		$.ajax({
			type: "POST",
			url: '/recordpressed',
			contentType: 'application/json',
			data: dataIn,
			success:function( response ) {
			datax= $.parseJSON(response);
			},
			error: function(error) {
					console.log(error);
			}
		});
	});

}

function setStop(dataIn)
{

	$(function() {
		$.ajax({
			type: "POST",
			url: '/stoppressed',
			contentType: 'application/json',
			data: dataIn,
			success:function( response ) {
			datax= $.parseJSON(response);
			setUnitsTable('#display')
			},
			error: function(error) {
					console.log(error);
			}
		});
	});

}

function onPatientSelectChange(sel)
{
	var mess = [];
	var $select = $(sel);
	var $cell = $select.parents('tbody tr');
	var $firstChild = $cell.find('>:first-child');
	var unit_id = $cell.attr('id');
	var js1 = new Object()
	js1.unit_id = unit_id;
	js1.pat_id = sel.value;
	mess.push(js1);
	var toCloud = JSON.stringify(js1);
	$firstChild.attr('id',sel.value);// set for future record

	$(function() {
		$.ajax({
			type: "POST",
			url: '/selectedpatientunittable',
			contentType: 'application/json',
			data: toCloud,
			success:function( response ) {
			var datax = $.parseJSON(response);			

			},
			error: function(error) {
					console.log(error);
			}
		});
	});
}

function onFileSelectChange(sel)
{
	var chart; // global
	theme = 'dark-unica';
	Highcharts.setOptions(theme );
	$('#display').empty();

	$(function () {
    $.getJSON('static/jsonFIle.json', function (data) {



        // Create a timer
        var start = +new Date();

        // Create the chart
        $('#display').highcharts('StockChart', {
            chart: {
                events: {
                    load: function () {
                        this.setTitle(null, {
                            text: 'Built chart in ' + (new Date() - start) + 'ms'
                        });
                    }
                },
                zoomType: 'x'
            },

            rangeSelector: {
                
                buttons: [{
                    type: 'second',
                    count: 1,
                    text: '1sec'
                }, {
                    type: 'second',
                    count: 5,
                    text: '5sec'
                }, {
                    type: 'second',
                    count: 10,
                    text: '10sec'
                }, {
                    type: 'second',
                    count: 30,
                    text: '30sec'
                }, {
                    type: 'minute',
                    count: 1,
                    text: '1min'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 4
            },

            yAxis: {
                title: {
                    text: 'Mv'
                }
            },

            title: {
                text: 'ECG RIchard Tapley '
            },

            subtitle: {
                text: 'Test Data From Galileo' // dummy text to reserve space for dynamic subtitle
            },

            series: [{
                name: 'Time',
				data:data,
                pointInterval:11.11,
                tooltip: {
                    valueDecimals: 3,
                    valueSuffix: 'Mv'
                }
            }]

        });
    });
});
}

function displayFile(divIn,datax)
{
	alert("in fuction "+datax);
}


function isAllocated(idIn)
{

	var js1 = new Object()
	js1.unit_id = idIn;
	var toCloud = JSON.stringify(js1);
	
	$(function() {
		$.ajax({
			type: "POST",
			async: false,
			url: '/ispatientallocated',
			contentType: 'application/json',
			data: toCloud,
			success:function( response ) {
			datax = $.parseJSON(response);

			},
			error: function(error) {
					console.log(error);
			}
		});
	});

	if(datax[0].unit_allocated == 1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function repeat(id)
{
	myTimer(id);
}


function myTimer(id)
{ 
	$(function() {
	$.ajax({
		type: "POST",
		url: '/getunitstable',
		data: { name: 'n/a'},
		success:function( response ) {
			var datax = $.parseJSON(response);
			for(var i in datax)
			{
				if (id == datax[i].unit_id)
				{
					$('#gif').empty();
					out = "<img id = 'anigif' src = ../static/Images/anigif2.gif /><p id ='bpm'>Unit Number "+datax[i].unit_number+"<br/>BPM = "+datax[i].unit_beat+"</p>";
					$('#gif').append(out);
				}
			}
		},
		error: function(error) {
				console.log(error);
		}
	});
}); 

}




