$(document).ready(function(){
  var template_dict = new Object();
  $.fn.exists = function () {
    return this.length !== 0;
  }
  //add cursor style
  $(".panel").mouseenter(function(){
      $(this).css({"cursor": "pointer"});
  });
  $(".add-btn").mouseenter(function(){
    $(this).parent().addClass('newhov');
  });
  $(".add-btn").mouseleave(function(){
    $(this).parent().removeClass('newhov');
  });
  $(".add-teach-btn").mouseenter(function(){
    $(this).parent().addClass('newhov');
  });
  $(".add-teach-btn").mouseleave(function(){
    $(this).parent().removeClass('newhov');
  });

  //lock edit
  $('table').on("click", ".work-last", function(){
    var status = $('.work-last').children().hasClass('fa-unlock');
    if (status) {
      $('.work-last').html('<i class="fas fa-lock"></i>');
      $("[contenteditable='true']").attr('contenteditable', 'false');
      $('.add-teach-btn').addClass('hide');
      $('.tdleft').children().addClass('hide');
      $('.delet-but').addClass('hide');
      $('.delet-teach-but').addClass('hide');
    } else {
      $('.work-last').html('<i class="fas fa-unlock"></i>');
      $("[contenteditable='false']").attr('contenteditable', 'true');
      $('.add-teach-btn').removeClass('hide');
      $('.tdleft').children().removeClass('hide');
      $('.delet-but').removeClass('hide');
      $('.delet-teach-but').removeClass('hide');
    }

  });

  //delete row hoverstyle
  $('.delet-but').mouseenter(function(){
    $(this).parent().parent().addClass('delehov');
  });
  $('.delet-but').mouseleave(function(){
    $(this).parent().parent().removeClass('delehov');
  });

  //hoverstyle
  $('table').on("mouseenter", ".check", function(){
    var column = $(this).attr('class').split(' ')[0];
    $(this).parent().addClass('tablehov');
    $('.'+column).addClass('tablehov');
    $('#teacher-list').find('.'+column).css({'color':'black'});
    $('#workload').find('.'+column).css({'color':'black'});
    $(this).addClass('tdhov');
  });
  $('table').on("mouseleave", ".check", function(){
    var column = $(this).attr('class').split(' ')[0];
    $(this).parent().removeClass('tablehov');
    $('.'+column).removeClass('tablehov');
    $('#teacher-list').find('.'+column).removeAttr('style');
    $('#workload').find('.'+column).removeAttr('style');
    $(this).removeClass('tdhov');
  });

  //delete column hoverstyle
  $('table').on("mouseenter", ".delet-teach-but", function(){
    var column = $(this).parent().attr('class').split(' ')[0];
    $('.'+column).addClass('delehov');
  });
  $('table').on("mouseleave", ".delet-teach-but", function(){
    var column = $(this).parent().attr('class').split(' ')[0];
    $('.'+column).removeClass('delehov');
  });

  //toggle panel
  $('table').on("click", ".toggle", function(){
    $(this).parents('tbody').siblings().slideToggle(500,'swing');
    var lock_status = $('.work-last').children().hasClass('fa-lock');
    var panel_status = $(this).parent().find('.tdleft').children().hasClass('hide');

    if(panel_status) {
      if(!lock_status){
        $(this).parent().find('.tdleft').children().removeClass('hide');
      }
    }else {
      $(this).parent().find('.tdleft').children().addClass('hide');
    }
    if(lock_status) {
      if(!panel_status) {
        $(this).parent().find('.tdleft').children().addClass('hide');
      }
    }
  });

  //add course
  $('table').on("click", ".add-btn", function(){
    var prev_num = $(this).parents('table').children().last().children().first().find('.id').text();
    if(isNaN(parseInt(prev_num))){
      var this_num = 1;
    }else{
      var this_num = parseInt(prev_num) + 1;
    }
    var $course = $('.course_model').clone(true).removeClass();
    $course.addClass('course-table');

    $course.children().first().find('.id').text("" + this_num);
    $(this).parents('table').children().last().after($course);

    var this_part = $(this).parent().parent().attr('id');
    $course.children().first().find('.course').children().addClass('course_name');
    $course.children().first().find('.course').addClass(this_part + '_course_' + this_num);
    var template = document.querySelector('#template').cloneNode(true);
    template_dict[this_part + '_course_' + this_num] = template;
    var tippyname = '.' + this_part + '_course_' + this_num;
    tippy(tippyname,{
      html: template,
      placement: 'right',
      delay: 100,
      arrow: true,
      arrowType: 'sharp',
      size: 'regular',
      duration: 300,
      followCursor: false,
      theme: 'default'
    });
  });

  //add section
  $('table').on("dblclick", ".add-section", function(){
    var this_course = $(this).parent().parent();
    var prev_num = this_course.children().last().find('.add-section').text().charAt(2);
    var this_num = parseInt(prev_num) + 1;
    this_course.find('.delete').children().first().addClass('tdhide');
    if(this_num <= 5) {
      var $section = this_course.children().first().clone(true);
      if($section.find('.selected').length !== 0){
        $section.find('.selected').html('');
        $section.find('.selected').removeClass('selected');
      }
      $section.find('.id').removeAttr('rowspan');
      $section.find('.course').removeAttr('rowspan');
      $section.find('.id').addClass('tdhide');
      $section.find('.course').addClass('tdhide');
      $section.find('.add-section').text("00" + this_num);
      $section.find('.delete').children().first().removeClass('tdhide');
      this_course.children().last().after($section);

    } else {
      alert("The maximum section is limited to 5!");
    }
  });

  //delete section
  $('table').on("click", ".delet-but", function(){
    var this_sec = $(this).parent().parent();
    var this_sec_num = parseInt(this_sec.find('.add-section').text().charAt(2));
    var this_course = $(this).parent().parent().parent();
    var this_dict = this_course.children().first().find('.course').attr('class').split(' ')[1];
    var this_course_name = this_course.children().first().find('.course').children().text();
    var sec_sum = this_course.find('tr').length;
    var rest_sec = $(this).parent().parent().nextAll();
    var rest_sec_num = rest_sec.length;

    var this_check = this_sec.find('.selected');
    if(this_check.length !== 0){
      var this_teach = this_check.attr('class').split(' ')[0];
      $('#summary').find('.' + this_teach).text(function(i, origValue){
        return ""+ (parseInt(origValue) - 1);
      });
      // check if workload is matched
      if($('#summary').find('.' + this_teach).text() != 0){
        if($('#summary').find('.' + this_teach).text()
        === $('#workload').find('.' + this_teach).children().text()){
          $('.' + this_teach).addClass('matched');
        } else{
          if($('.' + this_teach).hasClass('matched')){
            $('.' + this_teach).removeClass('matched');
          }
        }
      }else {
        $('.' + this_teach).removeClass('matched');
      }
    }

    if(sec_sum === 2) {
      this_course.children().first().find('.delete').children().first().removeClass('tdhide');
    }

    if(sec_sum === 1) {
      var rest_course = this_course.nextAll();
      var rest_course_num = rest_course.length;
      if( rest_course_num !== 0) {
        for(var i = 0; i < rest_course_num; i++) {
          rest_course.eq(i).children().find('.id').text(function(i, origValue){
            return ""+ (parseInt(origValue) - 1);
          });
        }
      }

    } else {
      if(this_sec_num === 1){
        $(this).parent().parent().next().find('.id').removeClass('tdhide');
        $(this).parent().parent().next().find('.id').attr('rowspan','5');
        $(this).parent().parent().next().find('.course').removeClass('tdhide');
        $(this).parent().parent().next().find('.course').attr('rowspan','5');
        $(this).parent().parent().next().find('.course').children().text(this_course_name);
      }

      if( rest_sec_num !== 0){
        for(var i = 0; i < rest_sec_num; i++) {
          rest_sec.eq(i).find('.add-section').text('00' + (this_sec_num + i));
        }
      }
    }
    this_sec.remove();

    if(this_sec_num === 1 && rest_sec_num === 0){
      delete template_dict[this_dict];
      this_course.remove();
    }
  });

  //add teacher
  $('table').on("click", ".add-teach-btn", function(){
    var prev_num = parseInt($(this).parent().prev().attr('class'));
    if(isNaN(parseInt(prev_num))){
      var this_num = 1;
    }else{
      var this_num = parseInt(prev_num) + 1;
    }
    var $add = $(this).parent().prev().clone(true).removeClass('section');
    $add.removeAttr('rowspan');
    $add.removeAttr('style');
    $add.attr('class',"" + this_num);
    $add.html('');
    // add panel column
    var $panel = $add.clone(true);
    $panel.addClass("noborder toggle");
    $('.tdright').before($panel);

    // add teacher column
    var $addteach = $add.clone(true);
    $addteach.html("<div contenteditable='true' class='teacher_name'>Undefined</div>");
    $('.add-teacher').before($addteach);

    $addteach.addClass("teach_"+this_num);
    var template = document.querySelector('#template').cloneNode(true);
    template_dict["teach_"+this_num] = template;
    tippy(".teach_"+this_num ,{
      html: template,
      placement: 'bottom',
      delay: 100,
      arrow: true,
      arrowType: 'sharp',
      size: 'regular',
      duration: 300,
      followCursor: false,
      theme: 'default'
    });


    //add workload column
    var $addwork = $add.clone(true);
    $addwork.removeAttr('title');
    $addwork.html("<div contenteditable='true'>0</div>");

    $('.work-last').before($addwork);

    // add every course column
    var $addcheck = $add.clone(true);
    $addcheck.addClass("check");
    $addcheck.removeAttr('title');
    $('.delete').before($addcheck);
    // add summary column
    var $addsum = $add.clone(true);
    $addsum.removeAttr('title');
    $addsum.text('0');
    $('.sum-last').before($addsum);
    var $add_dele = $add.clone(true);
    $add_dele.html('<div class="delet-teach-but"><i class="fas fa-trash-alt"></i></div>');
    $('.delete-last').before($add_dele);
  });

  //delete teacher
  $('table').on("click", ".delet-teach-but", function(){
    var this_num = $(this).parent().attr('class').split(' ')[0];
    $('.' + this_num).parent().find('.' + this_num).remove();
    delete template_dict["teach_"+this_num];
  });

  //check box
  $('table').on("click", ".check", function(){
    var prev_check = $(this).parent().find('.selected');
    var this_teach = $(this).attr('class').split(' ')[0];
    if (prev_check.length !== 0) {
      var prev_teach = prev_check.attr('class').split(' ')[0];
      if(this_teach === prev_teach) {
        $(this).removeClass("selected");
        $(this).html('');
        $('#summary').find('.' + this_teach).text(function(i, origValue){
          return ""+ (parseInt(origValue) - 1);
        });
        // check if workload is matched
        if($('#summary').find('.' + this_teach).text() != 0) {
          if($('#summary').find('.' + this_teach).text()
          === $('#workload').find('.' + this_teach).children().text()){
            $('.' + this_teach).addClass('matched');
          } else{
            if($('.' + this_teach).hasClass('matched')){
              $('.' + this_teach).removeClass('matched');
            }
          }
        } else {
          if($('.' + this_teach).hasClass('matched')) {
            $('.' + this_teach).removeClass('matched');
          }
        }

      } else {
        prev_check.html('');
        prev_check.removeClass('selected');
        $('#summary').find('.' + prev_teach).text(function(i, origValue){
          return ""+ (parseInt(origValue) - 1);
        });
        // check if workload is matched
        if($('#summary').find('.' + prev_teach).text() != 0) {
          if($('#summary').find('.' + prev_teach).text()
          === $('#workload').find('.' + prev_teach).children().text()){
            $('.' + prev_teach).addClass('matched');
          } else{
            if($('.' + prev_teach).hasClass('matched')){
              $('.' + prev_teach).removeClass('matched');
            }
          }
        } else {
          if($('.' + prev_teach).hasClass('matched')) {
            $('.' + prev_teach).removeClass('matched');
          }
        }

        $(this).html('<i class="fas fa-check-circle"></i>');
        $(this).addClass('selected');
        $('#summary').find('.' + this_teach).text(function(i, origValue){
          return ""+ (parseInt(origValue) + 1);
        });
        // check if workload is matched
        if($('#summary').find('.' + this_teach).text() != 0) {
          if($('#summary').find('.' + this_teach).text()
          === $('#workload').find('.' + this_teach).children().text()){
            $('.' + this_teach).addClass('matched');
          } else{
            if($('.' + this_teach).hasClass('matched')){
              $('.' + this_teach).removeClass('matched');
            }
          }
        } else {
          if($('.' + this_teach).hasClass('matched')) {
            $('.' + this_teach).removeClass('matched');
          }
        }
      }
    } else {
      $(this).html('<i class="fas fa-check-circle"></i>');
      $(this).addClass('selected');
      $('#summary').find('.' + this_teach).text(function(i, origValue){
        return ""+ (parseInt(origValue) + 1);
      });
      // check if workload is matched
      if($('#summary').find('.' + this_teach).text() != 0) {
        if($('#summary').find('.' + this_teach).text()
        === $('#workload').find('.' + this_teach).children().text()){
          $('.' + this_teach).addClass('matched');
        } else{
          if($('.' + this_teach).hasClass('matched')){
            $('.' + this_teach).removeClass('matched');
          }
        }
      } else {
        if($('.' + this_teach).hasClass('matched')) {
          $('.' + this_teach).removeClass('matched');
        }
      }
      }
    });

    $('table').on("blur", '.teacher_name', function(){
      var this_name = $(this).text().toLowerCase();
      var this_parent_num = $(this).parent().attr('class').split(' ')[0];
      if (this_name == '') {
        alert('Please enter a teacher name!');
      }else {
        if($('#' + this_name).exists()) {
          var content = document.querySelector('#' + this_name).cloneNode(true);
          template_dict['teach_'+ this_parent_num].innerHTML = content.innerHTML;
        } else {
          var content = document.querySelector('#template').cloneNode(true);
          template_dict['teach_'+ this_parent_num].innerHTML = content.innerHTML;
        }
      }
    });

    $('table').on("blur", '.course_name', function(){
      var this_name = $(this).text().toLowerCase();
      var this_dict = $(this).parent().attr('class').split(' ')[1];
      if (this_name == '') {
        alert('Please enter a course name!');
      }else {
        if($('#id' + this_name).exists()) {
          var content = document.querySelector('#id' + this_name).cloneNode(true);
          template_dict[this_dict].innerHTML = content.innerHTML;
        } else {
          var content = document.querySelector('#template').cloneNode(true);
          template_dict[this_dict].innerHTML = content.innerHTML;
        }
      }
    });

    //hide Sidebar
    $('#hide-btn').click(function(){
      if($('.grid-item-left').hasClass('hide')) {
        $('.grid-item-left').removeClass('hide');
        $('.grid-container').css('grid-template-columns', '320px auto');
        $(this).text('Hide Sidebar');
      } else {
        $('.grid-item-left').addClass('hide');
        $('.grid-container').css('grid-template-columns', 'auto auto');
        $(this).text('Show Sidebar');
      }
    });
});
