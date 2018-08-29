import React from "react";
import { View, StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";

const icon = require("../assets/google_icon.png");

const Google = ({ color, size }) => {
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

Google.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

Google.defaultProps = {
  color: "#DB4437",
  size: 40
};

export default Google;
