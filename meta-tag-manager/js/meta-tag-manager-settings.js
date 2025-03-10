jQuery(document).ready(function($){
	//Meta Box Options
	//$(".postbox > h2").on('click', function(){ $(this).parent().toggleClass('closed'); });
	//$(".postbox").addClass('closed');
	//Navigation Tabs
	$('.tabs-active .nav-tab-wrapper .nav-tab').on('click', function(){
		el = $(this);
		elid = el.attr('id');
		$('.mtm-menu-group').hide(); 
		$('.'+elid).show();
		//$(".postbox").addClass('closed');
		//open_close.text(EM.open_text);
	});
	$('.nav-tab-wrapper .nav-tab').on('click', function(){
		$('.nav-tab-wrapper .nav-tab').removeClass('nav-tab-active');
		$(this).addClass('nav-tab-active').blur();
	});
	var navUrl = document.location.toString();
	if (navUrl.match('#')) { //anchor-based navigation
		var nav_tab = navUrl.split('#');
		var current_tab = 'a#mtm-menu-' + nav_tab[1];
		$(current_tab).trigger('click');
		if( nav_tab.length > 2 ){
			section = $("#mtm-opt-"+nav_tab[2]);
			if( section.length > 0 ){
				section.children('h2').trigger('click');
		    	$('html, body').animate({ scrollTop: section.offset().top - 30 }); //sends user back to current section
			}
		}
	}else{
		//set to general tab by default, so we can also add clicked subsections
		document.location = navUrl+"#custom-meta-tags";
	}
	$('.tabs-active .nav-tab-wrapper .nav-tab.nav-tab-active').trigger('click');
	$('.nav-tab-link').on('click', function(){ $($(this).attr('rel')).trigger('click'); }); //links to mimick tabs
	$('input[type="submit"]').on('click', function(){
		var el = $(this).parents('.postbox').first();
		var docloc = document.location.toString().split('#');
		var newloc = docloc[0];
		if( docloc.length > 1 ){
			var nav_tab = docloc[1].split('#');
			newloc = newloc + "#" + nav_tab[0];
			if( el.attr('id') ){
				newloc = newloc + "#" + el.attr('id').replace('mtm-opt-','');
			}
		}
		document.location = newloc;
	});

	// settings trigger
	$('.mtm-settings-binary-trigger').on('change', function(){
		var el = $(this);
		if( el.prop('checked') ){
			$(el.data('trigger-content')).show();
		}else{
			$(el.data('trigger-content')).hide();
		}
	}).trigger('change');

	// image uploader

	jQuery(document).ready( function($) {

		$('.mtm-image-upload input.mtm-image-upload-submit').on('click', function(e) {
			e.preventDefault();
			var wrap = $(this).closest('.mtm-image-upload');
			var image_frame;
			if(image_frame){
				image_frame.open();
			}
			image_frame = wp.media({
				title: 'Select Media',
				multiple : false,
				library : {
					type : 'image',
				}
			});
			image_frame.on('close',function() {
				// get selections and save to hidden input plus other AJAX stuff etc.
				var selection =  image_frame.state().get('selection');
				var gallery_ids = new Array();
				var my_index = 0;
				selection.each(function(attachment) {
					gallery_ids[my_index] = attachment['id'];
					my_index++;
				});
				var ids = gallery_ids.join(",");
				wrap.find('.mtm-image-upload-input').val(ids);
				// refresh image
				var data = {
					action: wrap.data('action'),
					nonce: wrap.data('nonce'),
					id: ids
				};
				jQuery.get( ajaxurl, data, function (response) {
					if (response.success === true) {
						wrap.find('.mtm-image-upload-preview').html(response.data.image);
					}
				});
			});
			image_frame.on('open',function() {
				var selection =  image_frame.state().get('selection');
				ids = wrap.find('.mtm-image-upload-input').val().split(',');
				ids.forEach(function(id) {
					attachment = wp.media.attachment(id);
					attachment.fetch();
					selection.add( attachment ? [ attachment ] : [] );
				});

			});
			image_frame.on('toolbar:create:select',function() {
				image_frame.state().set('filterable', 'uploaded');
			});
			image_frame.open();
		});
	});
});