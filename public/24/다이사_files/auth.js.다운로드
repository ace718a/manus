var timer = null;

function authTimer(count, id, type){
	var minutes, seconds;
	var obj = id;

	timer = setInterval(function() {
		minutes = parseInt(count / 60, 10);
		seconds = parseInt(count % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		$('#' + id).html(minutes + ":" + seconds);

		// 타이머 끝
		if (--count < 0) {
			clearInterval(timer);

			$('#hp2').attr('disabled', false);
			$('#hp3').attr('disabled', false);
			$('#btn_auth_send').attr('disabled', false);

			if (type == 'e') {
				$('#authnum').attr('disabled', false);
				$('#' + id).html('');
				$('#text_auth_result').html('');
			} else {
				$('#text_auth_result').html('인증번호 입력가능시간이 초과 되었습니다. 인증번호를 다시 받아주세요!');
			}
		}

	}, 1000);
}

function authNumberSubmit() {
	var name = $('#name');
	var hp1 = $('#hp1');
	var hp2 = $('#hp2');
	var hp3 = $('#hp3');

	if($.trim(name.val()) == '') {
		alert('신청자 이름을 입력해 주세요');
		name.focus();
		return false;
	}

	if($.trim(hp1.val()) != '010') {
		alert('휴대폰번호를 입력해 주세요');
		return false;
	}

	if($.trim(hp2.val()) == '') {
		alert('휴대폰번호를 입력해 주세요');
		hp2.focus();
		return false;
	}

	if($.trim(hp3.val()) == '') {
		alert('휴대폰번호를 입력해 주세요');
		hp3.focus();
		return false;
	}

	var hp = hp1.val() + hp2.val() + hp3.val();

	$.ajax({
		type : 'POST',
		url : 'auth_api.php',
		data : { mode : 'request', hp : hp },
		dataType: 'json',
		async : false,
		error: function(xhr, status, error){
			alert('서버통신에 문제가 있습니다. 잠시후 다시 시도해 주세요.');
		},
		success : function(json){
			clearInterval(timer);

			$('#authnum').val('');
			$('#text_auth_result').html('');

			if(json['res']) {
				$('#authnum').attr('disabled', false);

				authTimer(180, 'countdown', 's');

				$('#btn_auth_send').html('재요청');

			} else {
				$('#authnum').attr('disabled', true);

				if(json['code'] == '200') {
					authTimer(180, 'countdown', 'e');
					
					$('#hp2').attr('disabled', true);
					$('#hp3').attr('disabled', true);
					$('#btn_auth_send').attr('disabled', true);
				}

				$('#text_auth_result').html('<p class="err">'+ json['msg'] +'</p>');
				//alert(json['msg']);
			}

		}
	});
}

function authNumberConfirm() {
	var name = $('#name');
	var hp1 = $('#hp1');
	var hp2 = $('#hp2');
	var hp3 = $('#hp3');
	var authnum = $('#authnum');

	if($.trim(name.val()) == '') {
		alert('신청자 이름을 입력해 주세요');
		name.focus();
		return false;
	}

	if($.trim(hp1.val()) != '010') {
		alert('휴대폰번호를 입력해 주세요');
		return false;
	}

	if($.trim(hp2.val()) == '') {
		alert('휴대폰번호를 입력해 주세요');
		hp2.focus();
		return false;
	}

	if($.trim(hp3.val()) == '') {
		alert('휴대폰번호를 입력해 주세요');
		hp3.focus();
		return false;
	}

	if($.trim(authnum.val()) == '') {
		alert('인증번호를 입력해 주세요');
		authnum.focus();
		return false;
	}

	var hp = hp1.val() + hp2.val() + hp3.val();

	$.ajax({
		type : 'POST',
		url : 'auth_api.php',
		data : { mode : 'confirm', hp : hp, authnum : authnum.val() },
		dataType: 'json',
		async : false,
		error: function(xhr, status, error){
			alert('서버통신에 문제가 있습니다. 잠시후 다시 시도해 주세요.');
		},
		success : function(json){
			if(json['res']) {
				$('#text_auth_result').html('<p class="suc">인증이 완료되었습니다.</p>');

				$('#authnum').attr('disabled', true);
				$('#btn_auth_confirm').attr('disabled', true);

				clearInterval(timer);

				$('#is_hp_auth').val('Y');

			} else {
				$('#text_auth_result').html('<p class="err">인증번호를 잘못 입력했습니다.</p>');
			}
		}
	});

}

$(document).ready(function(){
	$('.datepicker').datepicker({
		dateFormat: 'yy-mm-dd'
		,showOtherMonths: true
		,showMonthAfterYear:true
		,buttonText: '선택'
		,yearSuffix: '년' 
		,monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
		,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
		,dayNamesMin: ['일','월','화','수','목','금','토']
		,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일']
		,minDate: 2
		,maxDate: 90
	});

	$('#name').on('touchend, keyup', function(e) {
		if($.trim($(this).val()).length >= 2) {
			$('#hp2').attr('disabled', false);
			$('#hp3').attr('disabled', false);
		} else {
			$('#hp2').attr('disabled', true);
			$('#hp3').attr('disabled', true);
		}
	});

	$('#hp2, #hp3').on('touchend, keyup', function(e) {
		var phonePattern = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

		var hp = $('#hp1').val() + '-' + $('#hp2').val() + '-' + $('#hp3').val();

		if(phonePattern.test(hp)) {
			$('#btn_auth_send').attr('disabled', false);
		} else {
			$('#btn_auth_send').attr('disabled', true);
		
			$('#authnum').val('');
			$('#authnum').attr('disabled', true);
			$('#btn_auth_confirm').attr('disabled', true);

			clearInterval(timer);

			$('#countdown').html('');
			$('#text_auth_result').html('');

			$('#is_hp_auth').val('');
		}

	});

	$('#authnum').on('touchend, keyup', function(e) {
		if($(this).val().length >= 5) {
			$('#btn_auth_confirm').attr('disabled', false);
		} else {
			$('#btn_auth_confirm').attr('disabled', true);
		}
	});

});