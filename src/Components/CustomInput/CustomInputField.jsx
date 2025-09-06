import React, { useRef, useState } from "react";
import TooltipWrapper from "../Tooltip/TooltipWrapper";
import { RiInformation2Line } from "react-icons/ri";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import { FaRegCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const CustomInputField = ({
  field,
  colClass,
  onInput,
  onChange,
  onBlur,
  onFocus,
  value,
  error,
  onPaste,
  readOnly,
  disabled,
  isInvalid,
  dateRange,
  hideLabel
}) => {
  const inputRef = useRef(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const hasError = Boolean(error);
  const errorMessage = error ?? null;

  const handlePasswordVisibilityToggle = (fieldId) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [fieldId]: !prevState[fieldId]
    }));
  };

  const eyestyle = {
    fontSize: "18px",
    transition: "color 0.3s ease-in-out",
    position: "absolute",
    right: "1.4rem",
    top: "53%",
    transform: "translateX(-50%)",
    cursor: "pointer"
  };

  return (
    <div className={colClass} key={field.id} style={{ position: "relative" }}>
      {!hideLabel && (
        <label
          htmlFor={field?.id}
          className={`${
            field?.required
              ? "form-label fw-medium required-label"
              : "form-label fw-medium"
          }`}
        >
          {field?.label || ""}
        </label>
      )}

      {field.type === "date" ? (
        <DatePicker
          id={field?.id}
          name={field?.name}
          showIcon
          icon={<FaRegCalendarAlt />}
          selected={value ? parse(value, "yyyy-MM-dd", new Date()) : null}
          placeholderText="DD/MM/YYYY"
          minDate={field?.minDate || new Date(1930, 0, 1)}
          {...(!dateRange && {
            maxDate: new Date()
          })}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          onInput={onInput}
          onChange={(date) => {
            if (date) {
              const formattedDate = format(date, "yyyy-MM-dd");
              onChange({ target: { name: field?.name, value: formattedDate } });
            }
          }}
          onPaste={onPaste}
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className={`form-control ${
            isInvalid
              ? ""
              : hasError
              ? "hasError"
              : value !== undefined && value !== ""
              ? "is-valid is-valid-date"
              : ""
          }`}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={onFocus}
          onKeyDown={(e) => {
            let currentValue = e.target.value;
            const allowedKeys = [
              "Backspace",
              "Tab",
              "ArrowLeft",
              "ArrowRight",
              "Delete"
            ];
            if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
            if (
              currentValue.length === 2 &&
              !currentValue.includes("/") &&
              e.key !== "Backspace"
            ) {
              currentValue = currentValue + "/";
            }
            if (
              currentValue.length === 5 &&
              currentValue.charAt(2) == "/" &&
              e.key !== "Backspace"
            ) {
              currentValue = currentValue + "/";
            }
            if (currentValue.length >= 10 && e.key !== "Backspace") {
              e.preventDefault();
            }
            e.target.value = currentValue;
          }}
        />
      ) : (
        <input
          ref={inputRef}
          type={
            field?.type === "password" && passwordVisibility[field?.id]
              ? "text"
              : field?.type
          }
          id={field?.id}
          name={field?.name}
          className={`form-control ${
            field.type === "password" ? "customPasswordClass" : ""
          } ${
            isInvalid
              ? ""
              : hasError
              ? "hasError"
              : value !== undefined && value !== ""
              ? "is-valid"
              : ""
          }`}
          value={value}
          placeholder={field?.placeholder}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          onInput={onInput}
          onChange={onChange}
          onPaste={onPaste}
          onBlur={onBlur}
          style={{ paddingRight: "0.5rem" }}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={onFocus}
        />
      )}

      {field?.type === "password" && (
        <span
          style={eyestyle}
          onClick={() => handlePasswordVisibilityToggle(field?.id)}
        >
          {passwordVisibility[field?.id] ? (
            <AiTwotoneEyeInvisible size={20} />
          ) : (
            <AiTwotoneEye size={20} />
          )}
        </span>
      )}

      {hasError && (
        <TooltipWrapper tooltipMessage={errorMessage}>
          <span
            style={{
              position: "absolute",
              right: field?.type == "date" ? "40px" : "1rem",
              top: "50%",
              transform: "translateY(10%)",
              cursor: "pointer"
            }}
          >
            <RiInformation2Line color="#ff3d42" />
          </span>
        </TooltipWrapper>
      )}
    </div>
  );
};

export default CustomInputField;
