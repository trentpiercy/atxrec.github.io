function InfoBox(opt_opts) {
  (opt_opts = opt_opts || {}), google.maps.OverlayView.apply(
    this,
    arguments
  ), (this.content_ = opt_opts.content || ""), (this.disableAutoPan_ =
    opt_opts.disableAutoPan || !1), (this.maxWidth_ =
    opt_opts.maxWidth || 0), (this.pixelOffset_ =
    opt_opts.pixelOffset || new google.maps.Size(0, 0)), (this.position_ =
    opt_opts.position || new google.maps.LatLng(0, 0)), (this.zIndex_ =
    opt_opts.zIndex || null), (this.boxClass_ =
    opt_opts.boxClass || "infoBox"), (this.boxStyle_ =
    opt_opts.boxStyle || {}), (this.closeBoxMargin_ =
    opt_opts.closeBoxMargin || "2px"), (this.closeBoxURL_ =
    opt_opts.closeBoxURL ||
    "https://www.google.com/intl/en_us/mapfiles/close.gif"), "" ===
    opt_opts.closeBoxURL && (this.closeBoxURL_ = ""), (this.infoBoxClearance_ =
    opt_opts.infoBoxClearance || new google.maps.Size(1, 1)), void 0 ===
    opt_opts.visible &&
    (void 0 === opt_opts.isHidden
      ? (opt_opts.visible = !0)
      : (opt_opts.visible = !opt_opts.isHidden)), (this.isHidden_ = !opt_opts.visible), (this.alignBottom_ =
    opt_opts.alignBottom || !1), (this.pane_ =
    opt_opts.pane || "floatPane"), (this.enableEventPropagation_ =
    opt_opts.enableEventPropagation ||
    !1), (this.div_ = null), (this.closeListener_ = null), (this.moveListener_ = null), (this.contextListener_ = null), (this.eventListeners_ = null), (this.fixedWidthSet_ = null);
}
(InfoBox.prototype = new google.maps
  .OverlayView()), (InfoBox.prototype.createInfoBoxDiv_ = function() {
  var i,
    events,
    bw,
    me = this,
    cancelHandler = function(e) {
      (e.cancelBubble = !0), e.stopPropagation && e.stopPropagation();
    },
    ignoreHandler = function(e) {
      (e.returnValue = !1), e.preventDefault &&
        e.preventDefault(), me.enableEventPropagation_ || cancelHandler(e);
    };
  if (!this.div_) {
    if (
      (
        (this.div_ = document.createElement("div")),
        this.setBoxStyle_(),
        void 0 === this.content_.nodeType
          ? (this.div_.innerHTML = this.getCloseBoxImg_() + this.content_)
          : (
              (this.div_.innerHTML = this.getCloseBoxImg_()),
              this.div_.appendChild(this.content_)
            ),
        this.getPanes()[this.pane_].appendChild(this.div_),
        this.addClickHandler_(),
        this.div_.style.width
          ? (this.fixedWidthSet_ = !0)
          : 0 !== this.maxWidth_ && this.div_.offsetWidth > this.maxWidth_
            ? (
                (this.div_.style.width = this.maxWidth_),
                (this.div_.style.overflow = "auto"),
                (this.fixedWidthSet_ = !0)
              )
            : (
                (bw = this.getBoxWidths_()),
                (this.div_.style.width =
                  this.div_.offsetWidth - bw.left - bw.right + "px"),
                (this.fixedWidthSet_ = !1)
              ),
        this.panBox_(this.disableAutoPan_),
        !this.enableEventPropagation_
      )
    ) {
      for (
        this.eventListeners_ = [], events = [
          "mousedown",
          "mouseover",
          "mouseout",
          "mouseup",
          "click",
          "dblclick",
          "touchstart",
          "touchend",
          "touchmove"
        ], i = 0;
        i < events.length;
        i++
      )
        this.eventListeners_.push(
          google.maps.event.addDomListener(this.div_, events[i], cancelHandler)
        );
      this.eventListeners_.push(
        google.maps.event.addDomListener(this.div_, "mouseover", function(e) {
          this.style.cursor = "default";
        })
      );
    }
    (this.contextListener_ = google.maps.event.addDomListener(
      this.div_,
      "contextmenu",
      ignoreHandler
    )), google.maps.event.trigger(this, "domready");
  }
}), (InfoBox.prototype.getCloseBoxImg_ = function() {
  var img = "";
  return "" !== this.closeBoxURL_ &&
    (img =
      '<md-button class="md-icon-button infoBox-close" aria-label="More"><img src="icons/close.svg"/></md-button>'), img;
}), (InfoBox.prototype.addClickHandler_ = function() {
  var closeBox;
  "" !== this.closeBoxURL_
    ? (
        (closeBox = this.div_.firstChild),
        (this.closeListener_ = google.maps.event.addDomListener(
          closeBox,
          "click",
          this.getCloseClickHandler_()
        ))
      )
    : (this.closeListener_ = null);
}), (InfoBox.prototype.getCloseClickHandler_ = function() {
  var me = this;
  return function(e) {
    (e.cancelBubble = !0), e.stopPropagation &&
      e.stopPropagation(), google.maps.event.trigger(
      me,
      "closeclick"
    ), me.close();
  };
}), (InfoBox.prototype.panBox_ = function(disablePan) {
  var map,
    xOffset = 0,
    yOffset = 0;
  if (!disablePan && (map = this.getMap()) instanceof google.maps.Map) {
    map.getBounds().contains(this.position_) ||
      map.setCenter(this.position_), map.getBounds();
    var mapDiv = map.getDiv(),
      mapWidth = mapDiv.offsetWidth,
      mapHeight = mapDiv.offsetHeight,
      iwOffsetX = this.pixelOffset_.width,
      iwOffsetY = this.pixelOffset_.height,
      iwWidth = this.div_.offsetWidth,
      iwHeight = this.div_.offsetHeight,
      padX = this.infoBoxClearance_.width,
      padY = this.infoBoxClearance_.height,
      pixPosition = this.getProjection().fromLatLngToContainerPixel(
        this.position_
      );
    if (
      (
        pixPosition.x < -iwOffsetX + padX
          ? (xOffset = pixPosition.x + iwOffsetX - padX)
          : pixPosition.x + iwWidth + iwOffsetX + padX > mapWidth &&
              (xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth),
        this.alignBottom_
          ? pixPosition.y < -iwOffsetY + padY + iwHeight
            ? (yOffset = pixPosition.y + iwOffsetY - padY - iwHeight)
            : pixPosition.y + iwOffsetY + padY > mapHeight &&
                (yOffset = pixPosition.y + iwOffsetY + padY - mapHeight)
          : pixPosition.y < -iwOffsetY + padY
            ? (yOffset = pixPosition.y + iwOffsetY - padY)
            : pixPosition.y + iwHeight + iwOffsetY + padY > mapHeight &&
                (yOffset =
                  pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight),
        0 !== xOffset || 0 !== yOffset
      )
    ) {
      map.getCenter();
      map.panBy(xOffset, yOffset);
    }
  }
}), (InfoBox.prototype.setBoxStyle_ = function() {
  var i, boxStyle;
  if (this.div_) {
    (this.div_.className = this.boxClass_), (this.div_.style.cssText =
      ""), (boxStyle = this.boxStyle_);
    for (i in boxStyle)
      boxStyle.hasOwnProperty(i) && (this.div_.style[i] = boxStyle[i]);
    (this.div_.style.WebkitTransform = "translateZ(0)"), void 0 !==
      this.div_.style.opacity &&
      "" !== this.div_.style.opacity &&
      (
        (this.div_.style.MsFilter =
          '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' +
          100 * this.div_.style.opacity +
          ')"'),
        (this.div_.style.filter =
          "alpha(opacity=" + 100 * this.div_.style.opacity + ")")
      ), (this.div_.style.position = "absolute"), (this.div_.style.visibility =
      "hidden"), null !== this.zIndex_ &&
      (this.div_.style.zIndex = this.zIndex_);
  }
}), (InfoBox.prototype.getBoxWidths_ = function() {
  var computedStyle,
    bw = { top: 0, bottom: 0, left: 0, right: 0 },
    box = this.div_;
  return document.defaultView && document.defaultView.getComputedStyle
    ? (computedStyle = box.ownerDocument.defaultView.getComputedStyle(
        box,
        ""
      )) &&
        (
          (bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0),
          (bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0),
          (bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0),
          (bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0)
        )
    : document.documentElement.currentStyle &&
        box.currentStyle &&
        (
          (bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0),
          (bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0),
          (bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0),
          (bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0)
        ), bw;
}), (InfoBox.prototype.onRemove = function() {
  this.div_ &&
    (this.div_.parentNode.removeChild(this.div_), (this.div_ = null));
}), (InfoBox.prototype.draw = function() {
  this.createInfoBoxDiv_();
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);
  (this.div_.style.left = pixPosition.x + this.pixelOffset_.width + "px"), this
    .alignBottom_
    ? (this.div_.style.bottom =
        -(pixPosition.y + this.pixelOffset_.height) + "px")
    : (this.div_.style.top =
        pixPosition.y + this.pixelOffset_.height + "px"), this.isHidden_
    ? (this.div_.style.visibility = "hidden")
    : (this.div_.style.visibility = "visible");
}), (InfoBox.prototype.setOptions = function(opt_opts) {
  void 0 !== opt_opts.boxClass &&
    ((this.boxClass_ = opt_opts.boxClass), this.setBoxStyle_()), void 0 !==
    opt_opts.boxStyle &&
    ((this.boxStyle_ = opt_opts.boxStyle), this.setBoxStyle_()), void 0 !==
    opt_opts.content && this.setContent(opt_opts.content), void 0 !==
    opt_opts.disableAutoPan &&
    (this.disableAutoPan_ = opt_opts.disableAutoPan), void 0 !==
    opt_opts.maxWidth && (this.maxWidth_ = opt_opts.maxWidth), void 0 !==
    opt_opts.pixelOffset &&
    (this.pixelOffset_ = opt_opts.pixelOffset), void 0 !==
    opt_opts.alignBottom &&
    (this.alignBottom_ = opt_opts.alignBottom), void 0 !== opt_opts.position &&
    this.setPosition(opt_opts.position), void 0 !== opt_opts.zIndex &&
    this.setZIndex(opt_opts.zIndex), void 0 !== opt_opts.closeBoxMargin &&
    (this.closeBoxMargin_ = opt_opts.closeBoxMargin), void 0 !==
    opt_opts.closeBoxURL &&
    (this.closeBoxURL_ = opt_opts.closeBoxURL), void 0 !==
    opt_opts.infoBoxClearance &&
    (this.infoBoxClearance_ = opt_opts.infoBoxClearance), void 0 !==
    opt_opts.isHidden && (this.isHidden_ = opt_opts.isHidden), void 0 !==
    opt_opts.visible && (this.isHidden_ = !opt_opts.visible), void 0 !==
    opt_opts.enableEventPropagation &&
    (this.enableEventPropagation_ = opt_opts.enableEventPropagation), this
    .div_ && this.draw();
}), (InfoBox.prototype.setContent = function(content) {
  (this.content_ = content), this.div_ &&
    (
      this.closeListener_ &&
        (
          google.maps.event.removeListener(this.closeListener_),
          (this.closeListener_ = null)
        ),
      this.fixedWidthSet_ || (this.div_.style.width = ""),
      void 0 === content.nodeType
        ? (this.div_.innerHTML = this.getCloseBoxImg_() + content)
        : (
            (this.div_.innerHTML = this.getCloseBoxImg_()),
            this.div_.appendChild(content)
          ),
      this.fixedWidthSet_ ||
        (
          (this.div_.style.width = this.div_.offsetWidth + "px"),
          void 0 === content.nodeType
            ? (this.div_.innerHTML = this.getCloseBoxImg_() + content)
            : (
                (this.div_.innerHTML = this.getCloseBoxImg_()),
                this.div_.appendChild(content)
              )
        ),
      this.addClickHandler_()
    ), google.maps.event.trigger(this, "content_changed");
}), (InfoBox.prototype.setPosition = function(latlng) {
  (this.position_ = latlng), this.div_ &&
    this.draw(), google.maps.event.trigger(this, "position_changed");
}), (InfoBox.prototype.setZIndex = function(index) {
  (this.zIndex_ = index), this.div_ &&
    (this.div_.style.zIndex = index), google.maps.event.trigger(
    this,
    "zindex_changed"
  );
}), (InfoBox.prototype.setVisible = function(isVisible) {
  (this.isHidden_ = !isVisible), this.div_ &&
    (this.div_.style.visibility = this.isHidden_ ? "hidden" : "visible");
}), (InfoBox.prototype.getContent = function() {
  return this.content_;
}), (InfoBox.prototype.getPosition = function() {
  return this.position_;
}), (InfoBox.prototype.getZIndex = function() {
  return this.zIndex_;
}), (InfoBox.prototype.getVisible = function() {
  return void 0 !== this.getMap() && null !== this.getMap() && !this.isHidden_;
}), (InfoBox.prototype.show = function() {
  (this.isHidden_ = !1), this.div_ && (this.div_.style.visibility = "visible");
}), (InfoBox.prototype.hide = function() {
  (this.isHidden_ = !0), this.div_ && (this.div_.style.visibility = "hidden");
}), (InfoBox.prototype.open = function(map, anchor) {
  var me = this;
  anchor &&
    (
      (this.position_ = anchor.getPosition()),
      (this.moveListener_ = google.maps.event.addListener(
        anchor,
        "position_changed",
        function() {
          me.setPosition(this.getPosition());
        }
      ))
    ), this.setMap(map), this.div_ && this.panBox_();
}), (InfoBox.prototype.close = function() {
  var i;
  if (
    (
      this.closeListener_ &&
        (
          google.maps.event.removeListener(this.closeListener_),
          (this.closeListener_ = null)
        ),
      this.eventListeners_
    )
  ) {
    for (i = 0; i < this.eventListeners_.length; i++)
      google.maps.event.removeListener(this.eventListeners_[i]);
    this.eventListeners_ = null;
  }
  this.moveListener_ &&
    (
      google.maps.event.removeListener(this.moveListener_),
      (this.moveListener_ = null)
    ), this.contextListener_ &&
    (
      google.maps.event.removeListener(this.contextListener_),
      (this.contextListener_ = null)
    ), this.setMap(null);
});
