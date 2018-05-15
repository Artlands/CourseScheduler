var input = document.querySelector('#json_upload');
var preview = document.querySelector('.fileslist');
var jsonData = [];

input.style.opacity = 0;
input.addEventListener('change', updateFileDisplay);

function updateFileDisplay() {
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  var curFiles = input.files;
  if(curFiles.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'No files currently selected for upload';
    preview.appendChild(para);
  } else {
    var list = document.createElement('ol');
    preview.appendChild(list);
    for(var i = 0; i < curFiles.length; i++) {
      var listItem = document.createElement('li');
      var para = document.createElement('p');
      para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
      listItem.appendChild(para);
      list.appendChild(listItem);
    }
    //read uploaded files, push them into jsonData
    readmultifiles(curFiles);
  }
}

function returnFileSize(number) {
  if(number < 1024) {
    return number + 'bytes';
  } else if(number >= 1024 && number < 1048576) {
    return (number/1024).toFixed(1) + 'KB';
  } else if(number >= 1048576) {
    return (number/1048576).toFixed(1) + 'MB';
  }
}

//read uploaded files, push them into jsonData
function readmultifiles(files) {
  var reader = new FileReader();
  function readFile(index) {
    if( index >= files.length ) return;
    var file = files[index];
    reader.onload = function(e) {
      var tmp = e.target.result;
      jsonData.push(JSON.parse(tmp));
      readFile(index+1)
    }
    reader.readAsText(file);
  }
  readFile(0);
}

// below is used for parse jsonData
$(document).ready(function(){
  $.fn.exists = function () {
    return this.length !== 0;
  }
  $('#history-btn').on("click", function(){
    if(jsonData.length == 0) {
      alert("Please select history record file!");
    } else {
      for(var i = 0; i < jsonData.length; i++) {
        var this_Data = jsonData[i];
        //create teacher record
        var this_year_rec = this_Data['teacher_record'];
        for(var j = 0; j < this_year_rec.length ; j++) {
          var this_teach = this_year_rec[j];
          var name = this_teach['name'];
          var courses = this_teach['courses'];

          var year_rec = $('#year_temp').clone(true);
          year_rec.removeAttr('id');
          year_rec.find('b').text(this_Data['semester']);
          var ul = $("#ul_temp").clone(true);
          ul.removeAttr('id');
          for(var p = 0; p < courses.length; p++) {
            var course_rec = courses[p];
            ul.append('<li>' + course_rec +'</li>');
          }
          year_rec.append(ul);
          if($('#' + name).exists()) {
            $('#' + name).append(year_rec);
          } else {
            var this_teach_rec = $('#teacher_temp').clone(true);
            this_teach_rec.attr('id',name);
            this_teach_rec.find('b').text(name);
            this_teach_rec.append('<hr>');
            this_teach_rec.append(year_rec);
            $('#all_template').append(this_teach_rec);
          }
        }

        //create course record
        var this_year_cour = this_Data['course_record'];
        for(var j = 0; j < this_year_cour.length; j++) {
          var this_course = this_year_cour[j];
          var id = this_course['id'];
          var list = this_course['list'];

          var para = $('#p_temp').clone(true);
          para.removeAttr('id');
          para.find('b').text(this_Data['semester'] + ': ');
          for(var p = 0; p < list.length; p++) {
            var teach_rec = list[p];
            para.append('<span>' + teach_rec + ' ' + '</span>');
          }

          if($('#id' + id).exists()) {
            $('#id' + id).append(para);
          } else {
            var this_cour_rec = $('#course_temp').clone(true);
            this_cour_rec.attr('id', 'id' + id);
            this_cour_rec.find('b').text('Course ' + id);
            this_cour_rec.append('<hr>');
            this_cour_rec.append(para);
            $('#all_template').append(this_cour_rec);
          }
        }
      }
      alert("Read successfully!");
    }

  });

});
