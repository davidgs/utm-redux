/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import {
  FloatingLabel,
  FormControl,
  OverlayTrigger,
  Tooltip,
  InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmObj } from './types';

function UTMTextField({
  valueChanged,
  targetType,
  enableMe,
}: {
  valueChanged: (value: string) => void;
  targetType: string;
  enableMe: boolean;
}): JSX.Element {
  const [ariaLabel, setAriaLabel] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [errorLabel, setErrorLabel] = useState<string>('');
  const [showName, setShowName] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<string>('');
  const [validated, setValidated] = useState<boolean>(false);
  const [enableChoice, setEnableChoice] = useState<boolean>(true);
  const [tType, setTType] = useState<string>(targetType);
  const ref = useRef(null);

  // get the configuration
  useEffect(() => {
    window.electronAPI
      .getParams(null, targetType)
      .then((response: JSON) => {
        const c: UtmObj = JSON.parse(response);
        setAriaLabel(c.ariaLabel);
        setLabel(c.label);
        setErrorLabel(c.error);
        setShowName(c.showName);
        setTooltip(c.tooltip);
        console.log('Tooltip: ', c.tooltip);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, [targetType]);

  useEffect(() => {
    setEnableChoice(enableMe);
  }, [enableMe]);

  return (
    <>
      <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
        <FloatingLabel
          label={{ showName } ? `${label} (${tType})` : `${label}`}
        >
          <FormControl
            required
            disabled={!enableMe}
            ref={ref}
            id={`${targetType}-target`}
            aria-label={ariaLabel}
            aria-describedby={tooltip}
            onBlur={(eventKey) => {
              valueChanged(
                eventKey.target.value.replace(/ /g, '_').toLowerCase()
              );
            }}
          />
        </FloatingLabel>
      </OverlayTrigger>
      <Form.Control.Feedback type="invalid">{errorLabel}</Form.Control.Feedback>
    </>
  );
}

UTMTextField.propTypes = {
  valueChanged: PropTypes.func.isRequired,
  targetType: PropTypes.string.isRequired,
  enableMe: PropTypes.bool.isRequired,
};

export default UTMTextField;
