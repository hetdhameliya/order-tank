const Regex = {
  VALID_MAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  VALID_PHONE: /^[0-9]{10}$/,
  mobile_no: /^[6-9]\d{9}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
  pan: /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/
};
export default Regex;
