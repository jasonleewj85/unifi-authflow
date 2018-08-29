import React from "react";
import { View, StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";

const icon = require("../assets/fb_icon.png");

const FB = ({ color, size }) => {
  return (
    <Image
      resizeMode="contain"
      source={icon}
      style={{
        tintColor: color,
        height: size,
        width: size
      }}
    />
  );
};

const styles = StyleSheet.create({});

FB.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

FB.defaultProps = {
  color: "#3B5998",
  size: 40
};

export default FB;
