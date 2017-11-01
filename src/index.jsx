import React from 'react';
import '../style';
import RcMention, { Nav, toString, toEditorState, getMentions } from 'rc-editor-mention';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowequal from 'shallowequal';
import Icon from '@gag/icon-web';


class Mention extends React.Component {
  static Nav = Nav;
  static toString = toString;
  static toContentState = toEditorState;
  static toEditorState = text => {
    console.warn('Mention.toEditorState is deprecated. Use toContentState instead.');
    return toEditorState(text);
  }
  static getMentions = getMentions;
  constructor(props) {
    super(props);
    this.state = {
      suggestions: props.suggestions,
      focus: false,
    };
  }

  componentWillReceiveProps({ suggestions }) {
    if (!shallowequal(suggestions, this.props.suggestions)) {
      this.setState({
        suggestions,
      });
    }
  }

  onSearchChange = (value, prefix) => {
    if (this.props.onSearchChange) {
      return this.props.onSearchChange(value, prefix);
    }
    return this.defaultSearchChange(value);
  }

  onChange = (editorState) => {
    if (this.props.onChange) {
      this.props.onChange(editorState);
    }
  }

  defaultSearchChange(value: String): void {
    const searchValue = value.toLowerCase();
    const filteredSuggestions = (this.props.suggestions || []).filter(
      suggestion => suggestion.toLowerCase().indexOf(searchValue) !== -1,
    );
    this.setState({
      suggestions: filteredSuggestions,
    });
  }

  onFocus = (ev) => {
    this.setState({
      focus: true,
    });
    if (this.props.onFocus) {
      this.props.onFocus(ev);
    }
  }
  onBlur = (ev) => {
    this.setState({
      focus: false,
    });
    if (this.props.onBlur) {
      this.props.onBlur(ev);
    }
  }
  render() {
    const { className = '', prefixCls, loading } = this.props;
    const { suggestions, focus } = this.state;
    const cls = classNames(className, {
      [`${prefixCls}-active`]: focus,
    });

    const notFoundContent = loading
      ? <Icon type="loading" />
      : this.props.notFoundContent;

    return (
      <RcMention
        {...this.props}
        className={cls}
        onSearchChange={this.onSearchChange}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        suggestions={suggestions}
        notFoundContent={notFoundContent}
      />
    );
  }
}
Mention.defaultProps = {
  prefixCls: 'ant-mention',
  notFoundContent: '无匹配结果，轻敲空格完成输入',
  loading: false,
  multiLines: false,
};
Mention.propTypes = {
    prefixCls: PropTypes.string,
    suggestions: PropTypes.array,
    onSearchChange:PropTypes.func,
    onChange:PropTypes.func,
    notFoundContent: PropTypes.any,
    loading: PropTypes.bool,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    className: PropTypes.string,
    multiLines: PropTypes.bool,
    prefix: PropTypes.string,
    placeholder: PropTypes.string,
    getSuggestionContainer:PropTypes.func,
    onFocus:PropTypes.func,
    onBlur:PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
};
Mention.displayName = "Mention";
module.exports=Mention;
