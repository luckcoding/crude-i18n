import React from 'react';
import PropTypes from 'prop-types';

export const defaultLocale = {
  _locale: '',
  _translations: {},

  get locale() {
    return this._locale;
  },
  set locale(val) {
    this._locale = val;
  },

  get languages() {
    return Object.keys(this._translations);
  },

  get translations() {
    return this._translations;
  },
  set translations(val) {
    this._translations = val;
  },
};

class I18nProvider extends React.Component {
  constructor(props) {
    super(props);

    // set locale
    const { locale, translations } = props;
    defaultLocale.locale = locale;
    defaultLocale.translations = translations;

    this.state = {
      locale,
      translations,
    };
  }

  getChildContext() {
    return {
      locale: this.state.locale,
      translations: this.state.translations,
      languages: Object.keys(this.state.translations),
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

I18nProvider.childContextTypes = {
  locale: PropTypes.string,
  translations: PropTypes.object,
  languages: PropTypes.array,
};

I18nProvider.defaultProps = {
  locale: 'zh',
  translations: {},
};

I18nProvider.propTypes = {
  locale: PropTypes.string,
  translations: PropTypes.object,
  children: PropTypes.node,
};

export default I18nProvider;
