import { SvgIcon } from '@material-ui/core';
import { ReactComponent as MAI } from '../assets/tokens/MAI.svg';
import { ReactComponent as Context } from '../assets/tokens/CLAM.svg';
import { ReactComponent as StakedContext } from '../assets/tokens/sCLAM.svg';

function getMAITokenImage() {
  return <SvgIcon component={MAI} viewBox="0 0 32 32" style={{ height: '32px', width: '32px' }} />;
}

function getContextTokenImage() {
  return <SvgIcon component={Context} viewBox="0 0 32 32" style={{ height: '32px', width: '32px' }} />;
}

function getStakedContextTokenImage() {
  return <SvgIcon component={StakedContext} viewBox="0 0 32 32" style={{ height: '32px', width: '32px' }} />;
}

export function getTokenImage(name: 'CTXT' | 'DAI' | 'sCTXT'): JSX.Element {
  if (name === 'DAI') return getMAITokenImage();
  if (name === 'CTXT') return getContextTokenImage();
  if (name === 'sCTXT') return getStakedContextTokenImage();

  throw Error(`Token image doesn't support: ${name}`);
}

function toUrl(base: string): string {
  const url = window.location.origin;
  return url + '/' + base;
}

export function getTokenUrl(name: string) {
  if (name === 'CTXT') {
    const path = require('../assets/tokens/CLAM.svg').default;
    return toUrl(path);
  }

  if (name === 'sCTXT') {
    const path = require('../assets/tokens/sCLAM.svg').default;
    return toUrl(path);
  }

  throw Error(`Token url doesn't support: ${name}`);
}
