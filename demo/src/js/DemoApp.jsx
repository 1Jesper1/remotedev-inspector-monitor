import React from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import { connect } from 'react-redux';
import pkg from '../../../package.json';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Combobox from 'react-input-enhancements/lib/Combobox';
import * as base16 from 'base16';
import * as inspectorThemes from '../../../src/themes';
import getOptions from './getOptions';
import { push as pushRoute } from 'react-router-redux';

const styles = {
  wrapper: {
    height: '100vh',
    width: '80%',
    margin: '0 auto',
    paddingTop: '1px'
  },
  header: {
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%'
  },
  buttons: {
    display: 'flex',
    width: '40rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  muted: {
    color: '#CCCCCC'
  },
  button: {
    margin: '0.5rem'
  },
  links: {
    textAlign: 'center'
  },
  link: {
    margin: '0 0.5rem',
    cursor: 'pointer',
    display: 'block'
  },
  input: {
    display: 'inline-block',
    textAlign: 'left',
    width: '30rem'
  }
};

const themeOptions = [
  ...Object.keys(inspectorThemes)
    .map(value => ({ value, label: inspectorThemes[value].scheme })),
  null,
  ...Object.keys(base16)
    .map(value => ({ value, label: base16[value].scheme }))
    .filter(opt => opt.label)
];

const ROOT = process.env.NODE_ENV === 'production' ? '/redux-devtools-inspector/' : '/';

function buildUrl(options) {
  return `${ROOT}?` + [
    options.useExtension ? 'ext' : '',
    options.supportImmutable ? 'immutable' : '',
    options.theme ? 'theme=' + options.theme : '',
    options.dark ? 'dark' : ''
  ].filter(s => s).join('&');
}

class DemoApp extends React.Component {
  render() {
    const options = getOptions();

    return (
      <div style={styles.wrapper}>
        <PageHeader style={styles.header}>
          {pkg.name || <span style={styles.muted}>Package Name</span>}
        </PageHeader>
        <h5>{pkg.description || <span style={styles.muted}>Package Description</span>}</h5>
        <div style={styles.links}>
          <div style={styles.input}>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Theme:
                </Col>
                <Col sm={9}>
                  <InputGroup>
                    <Combobox options={themeOptions}
                              value={options.theme}
                              onSelect={value => this.setTheme(options, value)}
                              optionFilters={[]}>
                      {props => <FormControl {...props} type='text' />}
                    </Combobox>
                    <InputGroup.Addon>
                      <a onClick={this.toggleTheme}
                         style={styles.link}>
                        {options.dark ? 'Light theme' : 'Dark theme'}
                      </a>
                    </InputGroup.Addon>
                  </InputGroup>
                </Col>
              </FormGroup>
            </Form>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.buttons}>
            <Button onClick={this.props.increment} style={styles.button}>
              Increment
            </Button>
            <Button onClick={this.props.push} style={styles.button}>
              Push
            </Button>
            <Button onClick={this.props.pop} style={styles.button}>
              Pop
            </Button>
            <Button onClick={this.props.replace} style={styles.button}>
              Replace
            </Button>
            <Button onClick={this.props.changeNested} style={styles.button}>
              Change Nested
            </Button>
            <Button onClick={this.props.pushHugeArray} style={styles.button}>
              Push Huge Array
            </Button>
            <Button onClick={this.props.addHugeObect} style={styles.button}>
              Add Huge Object
            </Button>
            <Button onClick={this.props.addIterator} style={styles.button}>
              Add Iterator
            </Button>
            <Button onClick={this.props.addRecursive} style={styles.button}>
              Add Recursive
            </Button>
            <Button onClick={this.props.addImmutableMap} style={styles.button}>
              Add Immutable Map
            </Button>
            <Button onClick={this.props.changeImmutableNested} style={styles.button}>
              Change Immutable Nested
            </Button>
            <Button onClick={this.props.hugePayload} style={styles.button}>
              Huge Payload
            </Button>
            <Button onClick={this.props.addFunction} style={styles.button}>
              Add Function
            </Button>
            <Button onClick={this.props.addSymbol} style={styles.button}>
              Add Symbol
            </Button>
            <Button onClick={this.toggleTimeoutUpdate} style={styles.button}>
              Timeout Update {this.props.timeoutUpdateEnabled ? 'On' : 'Off'}
            </Button>
            <Button onClick={this.props.shuffleArray} style={styles.button}>
              Shuffle Array
            </Button>
          </div>
        </div>
        <div style={styles.links}>
          <a onClick={this.toggleExtension}
             style={styles.link}>
            {(options.useExtension ? 'Disable' : 'Enable') + ' Chrome Extension'}
          </a>
          <a onClick={this.toggleImmutableSupport}
             style={styles.link}>
            {(options.supportImmutable ? 'Disable' : 'Enable') + ' Full Immutable Support'}
          </a>
        </div>
      </div>
    );
  }

  toggleExtension = () => {
    const options = getOptions();

    this.props.pushRoute(buildUrl({ ...options, useExtension: !options.useExtension }));
  };

  toggleImmutableSupport = () => {
    const options = getOptions();

    this.props.pushRoute(buildUrl({ ...options, supportImmutable: !options.supportImmutable }));
  };

  toggleTheme = () => {
    const options = getOptions();

    this.props.pushRoute(buildUrl({ ...options, dark: !options.dark }));
  };

  setTheme = (options, theme) => {
    this.props.pushRoute(buildUrl({ ...options, theme }));
  };

  toggleTimeoutUpdate = () => {
    const enabled = !this.props.timeoutUpdateEnabled;
    this.props.toggleTimeoutUpdate(enabled);

    if (enabled) {
      this.timeout = setInterval(this.props.timeoutUpdate, 1000);
    } else {
      clearTimeout(this.timeout);
    }
  }
}

export default connect(
  state => state,
  {
    toggleTimeoutUpdate: timeoutUpdateEnabled => ({
      type: 'TOGGLE_TIMEOUT_UPDATE', timeoutUpdateEnabled
    }),
    timeoutUpdate: () => ({ type: 'TIMEOUT_UPDATE' }),
    increment: () => ({ type: 'INCREMENT' }),
    push: () => ({ type: 'PUSH' }),
    pop: () => ({ type: 'POP' }),
    replace: () => ({ type: 'REPLACE' }),
    changeNested: () => ({ type: 'CHANGE_NESTED' }),
    pushHugeArray: () => ({ type: 'PUSH_HUGE_ARRAY' }),
    addIterator: () => ({ type: 'ADD_ITERATOR' }),
    addHugeObect: () => ({ type: 'ADD_HUGE_OBJECT' }),
    addRecursive: () => ({ type: 'ADD_RECURSIVE' }),
    addImmutableMap: () => ({ type: 'ADD_IMMUTABLE_MAP' }),
    changeImmutableNested: () => ({ type: 'CHANGE_IMMUTABLE_NESTED' }),
    hugePayload: () => ({
      type: 'HUGE_PAYLOAD',
      payload: Array.from({ length: 10000 }).map((_, i) => i)
    }),
    addFunction: () => ({ type: 'ADD_FUNCTION' }),
    addSymbol: () => ({ type: 'ADD_SYMBOL' }),
    shuffleArray: () => ({ type: 'SHUFFLE_ARRAY' }),
    pushRoute
  }
)(DemoApp);
