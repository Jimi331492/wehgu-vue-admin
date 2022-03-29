/*
 * @Author: 龙际妙
 * @Date: 2021-10-14 18:32:18
 * @Description:
 * @FilePath: \wehgu-vue-admin\babel.config.js
 * @LastEditTime: 2022-03-26 20:52:48
 * @LastEditors: Please set LastEditors
 */
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // plugins: ['transform-remove-console']
  plugins: [...prodPlugins, '@babel/plugin-syntax-dynamic-import'],
}
