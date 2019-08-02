import React from 'react';
import PropTypes from 'prop-types';
import { isJson } from '@crude/extras';
import { defaultLocale } from './I18nProvider';

/**
 * Get the final translation result
 * @param  {Any} params       { id: "tansId", values: { value1: "" }, def: "default message", wrapper(){} }
 *                            { zh: "zhXX {name}", en: "enXX {name}", values: {} ...}
 * @param  {String} locale       "zh"
 * @param  {Object} translations { "zh": { "id1": "zhXX" }, "en": { "id1": "enXX" }, ...}
 * @return {String}              [description]
 */
function t(params = {}, locale = '', translations = {}) {
  const {
    id = '', def = '', values = {}, wrapper, ...langs
  } = params;

  // get text tmpl, like: 'zh xxx is {name}'
  let message = id ? translations[locale][id] : langs[locale];

  // set value
  Object.keys(values).forEach((name) => {
    const reg = new RegExp(`{${name}}`, 'g');
    message = message.replace(reg, values[name]);
  });

  message = typeof wrapper === 'function'
    ? wrapper(message, locale)
    : message;

  return message || def;
}

class I18n extends React.PureComponent {
  render() {
    const { locale, translations } = this.context;

    const { wrapper, ...props } = this.props;

    const message = t(props, locale, translations);

    return wrapper ? wrapper(message, locale) : message;
  }
}

I18n.contextTypes = {
  locale: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
};

I18n.propTypes = {
  id: PropTypes.string,
  def: PropTypes.node, // default
  values: PropTypes.object,
  wrapper: PropTypes.func,
};

/**
 * render message with pure func
 * @param {Any} params  "id" or { zh: '', en: '' }
 * @param {Any} options { values: {}, def: 'default message', wrapper () {}}
 */
export function Trans(params, options = {}) {
  if (typeof params === 'string') {
    params = { id: params };
  } else if (!isJson(params)) {
    params = {};
  }
  return t(Object.assign(params, options), defaultLocale.locale, defaultLocale.translations);
}

export default I18n;
