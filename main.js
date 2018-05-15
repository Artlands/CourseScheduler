$(document).ready(function(){
  var $TEACHER = $('#teacher-list');
  //search
  $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $(".course-table tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
  });
  //download schedule
  $('#download-btn').on("click", function() {
    function download() {
      var semester = $('#time').text().toLowerCase();
      // var teach_nums = $('.teacher_name').length;
      var course_record = [];
      var teacher_record = [];
      var courses_list = [];
      var teachers_list = [];

      // Get teachers records
      var all_teacher = $('.teacher_name');
      all_teacher.each(function() {
        var this_id = parseInt($(this).parent().attr('class').split(' ')[0]);
        var this_name = $(this).text();

        var teacher_hash = {};
        var courses = [];
        var this_courses = $('.' + this_id).filter('.selected');

        teachers_list.push(this_name);

        this_courses.each(function(){
          var course = $(this).parent().parent().children().first().find('.course').children().text();
          courses.push(course);
        })
        teacher_hash['name'] = this_name;
        teacher_hash['courses'] = courses;
        teacher_record.push(teacher_hash);
      });
      // Get courses records
      var all_courses = $('.course-table');
      all_courses.each(function() {
        var course_hash = {};
        var teachers = [];
        var this_course = $(this).find('.course').children().first().text();
        var find_teachers = $(this).find('.selected')
        find_teachers.each(function(){
          var teacher_id = parseInt($(this).attr('class').split(' ')[0]);
          var teacher_name = $('#teacher-list').find('.' + teacher_id).children().text().toLowerCase();
          teachers.push(teacher_name);
        });
        course_hash['id'] = this_course;
        course_hash['list'] = teachers;
        course_record.push(course_hash);
        courses_list.push(this_course);
      });

      var jsonObject = {
        "semester": semester,
        "course_record": course_record,
        "teacher_record": teacher_record,
        "course-list": courses_list,
        "teacher-list": teachers_list
      };
      var fileContents = JSON.stringify(jsonObject, null, 2);
      var fileName = semester + "Schedule.json";

      var pp = document.createElement('a');
      pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
      pp.setAttribute('download', fileName);
      pp.click();

    }
    setTimeout(function() {
      download()
    }, 500);
  });

  // $('#print-btn').on("click", function() {
  //   var printContent = $('#schedule-table');
  //   var windowUrl = 'about:blank';
  //
  //   var num;
  //   var uniqueName = new Date();
  //
  //   var windowName = 'Print' + uniqueName.getTime();
  //   var printWindow = window.open(num, windowName, 'left=50000,top=50000,width=0,height=0');
  //   var cssReference = printWindow.document.createElement("link")
  //   cssReference.href = "index.css";
  //   cssReference.rel = "stylesheet";
  //   cssReference.type = "text/css";
  //
  //   printWindow.document.write(printContent.outerHTML);
  //   printWindow.document.getElementsByTagName('head')[0].appendChild(cssReference);
  //
  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.close();
  // });
});
