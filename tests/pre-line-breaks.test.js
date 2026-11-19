/**
 * Line breaks inside <pre>
 *
 * Related issue: https://github.com/TurboDocx/html-to-docx/issues/252
 */

import HTMLtoDOCX from '../index';
import { parseDOCX } from './helpers/docx-assertions';

const convert = (html, options = {}) => HTMLtoDOCX(html, null, { browserLayout: true, ...options });
const LINE_BREAK_BETWEEN = (before, after) =>
  new RegExp(
    `${before}</w:t>\\s*<w:br w:type="textWrapping"/>\\s*<w:t xml:space="preserve">${after}`
  );

describe('<pre> line breaks', () => {
  test('writes each newline as <w:br/> instead of a raw line feed', async () => {
    const { xml } = await parseDOCX(await convert('<pre><code>a &lt; b\n  c</code></pre>'));

    expect(xml).toMatch(LINE_BREAK_BETWEEN('a &lt; b', ' {2}c'));
  });

  test('handles a plain <pre> without <code>', async () => {
    const { xml } = await parseDOCX(await convert('<pre>line 1\nline 2</pre>'));

    expect(xml).toMatch(LINE_BREAK_BETWEEN('line 1', 'line 2'));
  });

  test('leaves newlines outside <pre> alone', async () => {
    const { xml } = await parseDOCX(await convert('<p>one\ntwo</p>'));

    expect(xml).not.toMatch(/<w:br/);
  });

  test('keeps the 1.23.3 output without browserLayout', async () => {
    const { xml } = await parseDOCX(await HTMLtoDOCX('<pre>line 1\nline 2</pre>', null, {}));

    expect(xml).not.toMatch(/<w:br/);
  });
});
