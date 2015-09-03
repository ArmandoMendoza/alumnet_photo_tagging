(function ($) {
  function PhotoTagging (img, options) {
    var self = this;

    this.img = img;

    this.posX = null;
    this.posY = null;

    this.tags = options.tags;

    this.addCallback = options.addCallback;

    this.submitCallback = options.submitCallback;

    this.img.wrap('<div id="tag-wrapper"></div>');

    this.wrapper = $("#tag-wrapper");

    this.wrapper.css({width: this.img.outerWidth(), height: this.img.outerHeight()});

    this.wrapper.append(this.tagger);

    this.loadTags();

    this.img.click(
      function(e){
        //Determine area within element that mouse was clicked
        mouseX = e.pageX - $("#tag-wrapper").offset().left;
        mouseY = e.pageY - $("#tag-wrapper").offset().top;

        //Get height and width of #tag-target
        targetWidth = $("#tag-target").outerWidth();
        targetHeight = $("#tag-target").outerHeight();

        //Determine position for #tag-target
        targetX = mouseX-targetWidth/2;
        targetY = mouseY-targetHeight/2;

        //Determine position for #tag-input
        inputX = mouseX+targetWidth/2;
        inputY = mouseY-targetHeight/2;

        //Animate if second click, else position and fade in for first click
        if($("#tag-target").css("display")=="block")
        {
          $("#tag-target").animate({left: targetX, top: targetY}, 500);
          $("#tag-input").animate({left: inputX, top: inputY}, 500);
        } else {
          $("#tag-target").css({left: targetX, top: targetY}).fadeIn();
          $("#tag-input").css({left: inputX, top: inputY}).fadeIn();
        }

        self.posX = targetX;
        self.posY = targetY;
      }
    );

    $('a#tag-submit').click(
      function(e){
        e.preventDefault();
        // here the function to send the data to server
        text = $('#tag-name').val();
        if(text == ""){ return; }
        self.submitCallback(self, text, self.posX, self.posY)
      }
    );

    $('a#tag-cancel').click(
      function(e){
        e.preventDefault();
        self.hideTagger();
      }
    );

  }

  PhotoTagging.prototype = {
    tagger: function(){
      return '<div id="tag-target"></div><div id="tag-input"><label for="tag-name">Person\'s Name:</label><input type="text" id="tag-name"><a href="#" id="tag-submit" class="btn">Submit</a><a href="#" id="tag-cancel" class="btn">Cancel</a></div>'
    },

    hideTagger: function(){
      $("#tag-target").fadeOut();
      $("#tag-input").fadeOut();
      $("#tag-name").val("");
      this.posY = null;
      this.posX = null;
    },

    addTag: function(id, text, posX, posY){
      this.wrapper.append('<div id="hotspot-' + id + '" class="hotspot" style="left:' + posX + 'px; top:' + posY + 'px;"><span>' + text + '</span></div>');
      this.hideTagger();
      if(this.addCallback){
        this.addCallback(id, text, posX, posY)
      }
    },

    removeTag: function(id){
      this.wrapper.find("div#hotspot-" + id).remove();
    },

    showTag: function(id){
      this.wrapper.find("div#hotspot-" + id).addClass("hotspothover");
    },

    hideTag: function(id){
      this.wrapper.find("div#hotspot-" + id).removeClass("hotspothover");
    },

    loadTags: function(){
      self = this;
      $.each(this.tags, function(index, tagData){
        self.addTag(tagData.id, tagData.text, tagData.posX, tagData.posY);
      });
    }

  }

  $.fn.photo_tagging = function (options) {
    // merge options with default options
    var settings = $.extend({}, $.fn.photo_tagging.defaultOptions, options);

    // create a instance of PhotoTaggin - this is the core of plugin
    var photoTagging = new PhotoTagging(this, settings);

    // add the instance to element
    this.data('photoTagging', photoTagging);
  }

  $.fn.photo_tagging.defaultOptions = {
    // Initial Tags
    tags: [],

    // this is function(id, text, posX, posY) is trigger when a tag is added
    addCallback: false,

    // this function(plugin, text, posX, posY) where plugin is used to addTag with a generate id.
    submitCallback: function(plugin, text, posX, posY){
      id = new Date().getTime();
      plugin.addTag(id, text, posX, posY);
    }
  }
}(jQuery));
