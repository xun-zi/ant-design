/* eslint-disable no-console */
import React, { useState } from 'react';
import Space from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import ConfigProvider from '../../config-provider';

describe('Space', () => {
  mountTest(Space);
  rtlTest(Space);

  it('should render width empty children', () => {
    const { container } = render(<Space />);

    expect(container.children.length).toBe(0);
  });

  it('should render width ConfigProvider', () => {
    const { container } = render(
      <ConfigProvider space={{ size: 'large' }}>
        <Space>
          <span>1</span>
          <span>2</span>
        </Space>
        <Space size="middle">
          <span>1</span>
          <span>2</span>
        </Space>
        <Space size="large">
          <span>1</span>
          <span>2</span>
        </Space>
      </ConfigProvider>,
    );

    expect(container.children).toMatchSnapshot();
  });

  it('should render width rtl', () => {
    const { container } = render(
      <ConfigProvider direction="rtl">
        <Space>
          <span>1</span>
          <span>2</span>
        </Space>
        <Space size="middle">
          <span>1</span>
          <span>2</span>
        </Space>
        <Space size="large">
          <span>1</span>
          <span>2</span>
        </Space>
      </ConfigProvider>,
    );

    expect(container.children).toMatchSnapshot();
  });

  it('should render width customize size', () => {
    const { container } = render(
      <Space size={10}>
        <span>1</span>
        <span>2</span>
      </Space>,
    );

    expect(container.querySelector<HTMLDivElement>('div.ant-space-item')?.style.marginRight).toBe(
      '10px',
    );
    expect(
      container.querySelectorAll<HTMLDivElement>('div.ant-space-item')[1]?.style.marginRight,
    ).toBe('');
  });

  it('should render width size 0', () => {
    const { container } = render(
      <Space size={NaN}>
        <span>1</span>
        <span>2</span>
      </Space>,
    );

    expect(container.querySelector<HTMLDivElement>('div.ant-space-item')?.style.marginRight).toBe(
      '0px',
    );
  });

  it('should render vertical space width customize size', () => {
    const { container } = render(
      <Space size={10} direction="vertical">
        <span>1</span>
        <span>2</span>
      </Space>,
    );

    expect(container.querySelector<HTMLDivElement>('div.ant-space-item')?.style.marginBottom).toBe(
      '10px',
    );
    expect(
      container.querySelectorAll<HTMLDivElement>('div.ant-space-item')[1]?.style.marginBottom,
    ).toBe('');
  });

  it('should render correct with children', () => {
    const { container } = render(
      <Space>
        text1<span>text1</span>
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>text3</>
      </Space>,
    );

    expect(container.children[0]).toMatchSnapshot();
  });

  it('should render with invalidElement', () => {
    const { container } = render(
      <Space>
        text1<span>text1</span>
        text1
      </Space>,
    );

    expect(container.querySelectorAll('div.ant-space-item').length).toBe(3);
  });

  it('should be keep store', () => {
    function Demo() {
      const [state, setState] = React.useState(1);

      return (
        <div
          id="demo"
          onClick={() => {
            setState((value) => value + 1);
          }}
        >
          {state}
        </div>
      );
    }
    function SpaceDemo() {
      const [visible, setVisible] = useState(true);
      function onChange() {
        setVisible(!visible);
      }
      return (
        <Space>
          {visible && <div>space</div>}
          <Demo />
          <p onClick={onChange}>Three</p>
        </Space>
      );
    }
    const { container } = render(<SpaceDemo />);

    expect(container.querySelector('#demo')).toHaveTextContent('1');

    fireEvent.click(container.querySelector('#demo')!);

    expect(container.querySelector('#demo')).toHaveTextContent('2');

    fireEvent.click(container.querySelector('p')!);

    expect(container.querySelector('#demo')).toHaveTextContent('2');
  });

  it('split', () => {
    const { container } = render(
      <Space split="-">
        text1<span>text1</span>
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>text3</>
      </Space>,
    );

    expect(container.children[0]).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/35305
  it('should not throw duplicated key warning', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <Space>
        <div key="1" />
        <div />
        <div key="3" />
        <div />
      </Space>,
    );
    expect(spy).not.toHaveBeenCalledWith(
      expect.stringContaining('Encountered two children with the same key'),
      expect.anything(),
      expect.anything(),
    );
    spy.mockRestore();
  });

  it('should render the hidden empty item wrapper', () => {
    const Null = () => null;
    const { container } = render(
      <Space>
        <Null />
      </Space>,
    );
    const item = container.querySelector('div.ant-space-item') as HTMLElement;

    expect(item).toBeEmptyDOMElement();
    expect(getComputedStyle(item).display).toBe('none');
  });

  it('should ref work', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Space ref={ref}>
        <span>Text1</span>
        <span>Text2</span>
      </Space>,
    );

    expect(ref.current).toBe(container.firstChild);
  });
});
