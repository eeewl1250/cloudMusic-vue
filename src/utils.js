const utils = {
  // JavaScript里的换行符，转化为html字符
  newlineConvert (text) {
    return text.replace(/\n/g, '<br>')
  },
  getStyle (obj, attr) {
    if (typeof getComputedStyle) {
      return getComputedStyle(obj, null)[attr]
    } else {
      return obj.currentStyle[attr]
    }
  },
  getKeyFrameRule (name) {
    let rules = []
    for (let styleSheet of document.styleSheets) {
      for (let cssRule of styleSheet.cssRules) {
        if (cssRule.name === name && cssRule.type === CSSRule.KEYFRAMES_RULE) {
          rules.push(cssRule)
        }
      }
    }
    return rules
  },
  deleteKeyFrameRule (name, frame) {
    let rules = this.getKeyFrameRule(name)
    for (let rule of rules) {
      rule.deleteRule(frame)
    }
  },
  appendKeyFrameRule (name, frame, newRule) {
    let rules = this.getKeyFrameRule(name)
    for (let rule of rules) {
      rule.appendRule(frame + ' { ' + newRule + '}')
    }
  },
  // 时间格式化 00：00
  timeStyle (time) {
    time = Math.floor(time)
    let minutes = this.prefixZero(Math.floor(time / 60), 2)
    let seconds = this.prefixZero(time % 60, 2)
    return minutes + ':' + seconds
  },
  // 数据格式化，不足位补零
  prefixZero (num, len) {
    num = Array.apply(null, { length: len }).fill('0').join('') + num
    return num.slice(num.length - 2  > len ? -num.length + 2 : -len)
  },
  // 弹出浮层，则禁止底层移动
  stopBodyMove (_this) {
    document.body.style.overflow = 'hidden'
    _this.$on(e => { e.preventDefault() })
  },
  // 关闭浮层，允许底层移动
  bodyMove (_this) {
    document.body.style.overflow = ''
    _this.$off(e => { e.preventDefault() })
  },
}

export default utils
