/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50610
Source Host           : localhost:3306
Source Database       : location

Target Server Type    : MYSQL
Target Server Version : 50610
File Encoding         : 65001

Date: 2017-04-19 10:28:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for eletag
-- ----------------------------
DROP TABLE IF EXISTS `eletag`;
CREATE TABLE `eletag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(40) NOT NULL DEFAULT '',
  `alias` varchar(80) DEFAULT NULL,
  `insertTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of eletag
-- ----------------------------
INSERT INTO `eletag` VALUES ('24', '1', '2', '2017-03-08 16:55:55');
INSERT INTO `eletag` VALUES ('25', '3', '2', '2017-03-08 16:56:19');
INSERT INTO `eletag` VALUES ('26', '4', '标签1', '2017-03-08 16:59:49');
INSERT INTO `eletag` VALUES ('27', '5', '标签2', '2017-03-08 17:00:05');
INSERT INTO `eletag` VALUES ('29', '6', '标签4', '2017-03-08 17:00:26');
INSERT INTO `eletag` VALUES ('30', '2', '标签22', '2017-03-08 17:27:02');
INSERT INTO `eletag` VALUES ('31', '7', '111111', '2017-03-10 11:29:55');
INSERT INTO `eletag` VALUES ('32', '8', 'biaoqian8', '2017-03-22 13:57:42');
INSERT INTO `eletag` VALUES ('33', '9', 'biaoqian9', '2017-03-16 13:57:46');
INSERT INTO `eletag` VALUES ('34', '10', 'biaoqian10', '2017-03-14 11:56:55');
INSERT INTO `eletag` VALUES ('35', '11', '11', '0000-00-00 00:00:00');
INSERT INTO `eletag` VALUES ('36', '12', '12', '2017-04-07 06:57:55');
INSERT INTO `eletag` VALUES ('37', '13', '13', '2017-04-07 07:03:06');

-- ----------------------------
-- Table structure for gps
-- ----------------------------
DROP TABLE IF EXISTS `gps`;
CREATE TABLE `gps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(40) NOT NULL,
  `alias` varchar(80) DEFAULT NULL,
  `insertTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gps
-- ----------------------------
INSERT INTO `gps` VALUES ('1', '1', '1', '0000-00-00 00:00:00');
INSERT INTO `gps` VALUES ('2', '2', '2', '2017-04-10 01:50:32');
INSERT INTO `gps` VALUES ('3', '3', '3', '2017-04-10 01:50:58');
INSERT INTO `gps` VALUES ('4', '4', '4', '2017-04-10 01:51:35');
INSERT INTO `gps` VALUES ('5', '5', '5', '2017-04-10 01:51:41');
INSERT INTO `gps` VALUES ('6', '6', '6', '2017-04-10 01:51:46');
INSERT INTO `gps` VALUES ('7', '7', '7', '2017-04-10 01:51:51');
INSERT INTO `gps` VALUES ('8', '8', '8', '2017-04-10 01:51:55');
INSERT INTO `gps` VALUES ('9', '9', '9', '2017-04-10 01:52:00');
INSERT INTO `gps` VALUES ('10', '10', '10', '2017-04-10 01:52:06');
INSERT INTO `gps` VALUES ('11', '11', '11', '2017-04-10 01:52:13');
INSERT INTO `gps` VALUES ('12', '12', '12', '2017-04-14 10:34:23');

-- ----------------------------
-- Table structure for gpsobj
-- ----------------------------
DROP TABLE IF EXISTS `gpsobj`;
CREATE TABLE `gpsobj` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(80) NOT NULL,
  `type_id` int(11) NOT NULL,
  `gps_id` int(11) DEFAULT NULL,
  `state` varchar(10) DEFAULT NULL,
  `insertTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `updateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `lastValue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gpsID` (`gps_id`) USING BTREE,
  KEY `typeID` (`type_id`) USING BTREE,
  CONSTRAINT `gpsID` FOREIGN KEY (`gps_id`) REFERENCES `gps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gpsobj
-- ----------------------------
INSERT INTO `gpsobj` VALUES ('1', '1', '2', '1', 'true', '2017-04-18 15:01:30', '2017-04-18 15:01:30', '39.903229333333336,116.317022');
INSERT INTO `gpsobj` VALUES ('2', '2', '2', '2', 'true', '2017-04-19 10:23:04', '2017-04-19 10:23:04', '40.069345,116.276807');
INSERT INTO `gpsobj` VALUES ('3', '3', '2', '3', 'true', '2017-04-19 10:23:18', '2017-04-19 10:23:18', '40.076744,116.268039');

-- ----------------------------
-- Table structure for hisdata
-- ----------------------------
DROP TABLE IF EXISTS `hisdata`;
CREATE TABLE `hisdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gpsobj_id` int(11) DEFAULT NULL,
  `coordinate` varchar(255) DEFAULT NULL,
  `insertTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `gpsobjID` (`gpsobj_id`) USING BTREE,
  CONSTRAINT `gpsobjID` FOREIGN KEY (`gpsobj_id`) REFERENCES `gpsobj` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of hisdata
-- ----------------------------
INSERT INTO `hisdata` VALUES ('1', '1', '{\"lng\":116.276807,\"lat\":40.069345}', '2017-04-14 18:06:34');
INSERT INTO `hisdata` VALUES ('2', '1', '\r\n{\"lng\":116.268039,\"lat\":40.076744}', '2017-04-14 18:07:21');
INSERT INTO `hisdata` VALUES ('3', '1', '{\"lng\":116.287874,\"lat\":40.07056}', '2017-04-14 18:07:25');
INSERT INTO `hisdata` VALUES ('4', '1', '{\"lng\":116.306271,\"lat\":40.076854}', '2017-04-14 18:07:44');
INSERT INTO `hisdata` VALUES ('5', '1', '{\"lng\":116.326249,\"lat\":40.079614}', '2017-04-14 18:07:59');
INSERT INTO `hisdata` VALUES ('6', '1', '{\"lng\":116.350108,\"lat\":40.078952}', '2017-04-14 18:08:14');
INSERT INTO `hisdata` VALUES ('7', '2', '{\"lng\":116.244036,\"lat\":40.066143}', '2017-04-14 18:08:29');
INSERT INTO `hisdata` VALUES ('8', '2', '{\"lng\":116.261859,\"lat\":40.065259}', '2017-04-14 18:08:45');
INSERT INTO `hisdata` VALUES ('9', '2', '{\"lng\":116.279537,\"lat\":40.06548}', '2017-04-14 18:09:02');
INSERT INTO `hisdata` VALUES ('10', '2', '{\"lng\":116.288161,\"lat\":40.06051}', '2017-04-14 18:12:09');
INSERT INTO `hisdata` VALUES ('11', '2', '\r\n{\"lng\":116.307421,\"lat\":40.059185}', '2017-04-14 18:12:40');
INSERT INTO `hisdata` VALUES ('12', '2', '{\"lng\":116.328118,\"lat\":40.058522}', '2017-04-14 18:12:57');
INSERT INTO `hisdata` VALUES ('13', '2', '{\"lng\":116.346228,\"lat\":40.059848}', '2017-04-14 18:13:12');

-- ----------------------------
-- Table structure for locobj
-- ----------------------------
DROP TABLE IF EXISTS `locobj`;
CREATE TABLE `locobj` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(80) NOT NULL,
  `type_id` int(11) NOT NULL DEFAULT '0',
  `eletag_id` int(11) DEFAULT '0',
  `state` varchar(20) DEFAULT '',
  `insertTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `data` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `eletagID` (`eletag_id`) USING BTREE,
  KEY `typeID` (`type_id`) USING BTREE,
  CONSTRAINT `eletagID` FOREIGN KEY (`eletag_id`) REFERENCES `eletag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `typeID` FOREIGN KEY (`type_id`) REFERENCES `loctype` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of locobj
-- ----------------------------
INSERT INTO `locobj` VALUES ('34', '22232', '3', null, 'false', '2017-03-21 11:13:43', '2017-03-21 11:13:43', '{\"x\":110.0,\"y\":110.0}');
INSERT INTO `locobj` VALUES ('35', '121', '2', null, 'false', '2017-03-20 14:00:55', '2017-03-20 14:00:55', '{\"x\":200,\"y\":100}');
INSERT INTO `locobj` VALUES ('36', '212', '2', null, 'false', '2017-03-20 14:00:59', '2017-03-20 14:00:59', '{\"x\":300,\"y\":100}');
INSERT INTO `locobj` VALUES ('37', 'wq', '3', '24', 'true', '2017-03-16 17:25:11', '2017-03-16 17:25:11', '{\"x\":400,\"y\":100}');
INSERT INTO `locobj` VALUES ('38', '123', '3', '26', 'true', '2017-03-20 14:13:44', '2017-03-20 14:13:44', '{\"x\":500,\"y\":100}');
INSERT INTO `locobj` VALUES ('39', '1', '3', '30', 'true', '2017-03-17 11:52:41', '2017-03-17 11:52:41', '{\"x\":600,\"y\":100}');
INSERT INTO `locobj` VALUES ('40', '111111', '2', null, 'false', '2017-03-17 14:17:41', '2017-03-17 14:17:41', null);
INSERT INTO `locobj` VALUES ('41', '1111', '2', null, 'false', '2017-03-20 18:49:17', '2017-03-20 18:49:17', null);
INSERT INTO `locobj` VALUES ('42', '', '2', '25', 'true', '2017-03-20 18:48:54', '2017-03-20 18:48:54', null);
INSERT INTO `locobj` VALUES ('43', '', '2', '32', 'true', '2017-03-20 18:49:02', '2017-03-20 18:49:02', null);
INSERT INTO `locobj` VALUES ('44', '', '2', '34', 'true', '2017-03-20 18:49:10', '2017-03-20 18:49:10', null);

-- ----------------------------
-- Table structure for loctype
-- ----------------------------
DROP TABLE IF EXISTS `loctype`;
CREATE TABLE `loctype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typeNum` int(11) NOT NULL,
  `typeName` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of loctype
-- ----------------------------
INSERT INTO `loctype` VALUES ('2', '2', '传感器');
INSERT INTO `loctype` VALUES ('3', '3', '人');

-- ----------------------------
-- Table structure for points
-- ----------------------------
DROP TABLE IF EXISTS `points`;
CREATE TABLE `points` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paths` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of points
-- ----------------------------
INSERT INTO `points` VALUES ('1', '[{\"lng\":115.890751,\"lat\":40.09783},{\"lng\":116.159811,\"lat\":39.630852},{\"lng\":116.880755,\"lat\":39.798694},{\"lng\":116.630092,\"lat\":40.136674},{\"lng\":116.416224,\"lat\":40.176377},{\"lng\":116.201205,\"lat\":40.173731}]');
INSERT INTO `points` VALUES ('2', '2');
