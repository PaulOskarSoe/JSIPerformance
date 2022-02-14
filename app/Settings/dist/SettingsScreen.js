"use strict";
exports.__esModule = true;
var dayjs_1 = require("dayjs");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_picker_select_1 = require("react-native-picker-select");
var MainContext_1 = require("../context/MainContext");
var storage_1 = require("../storage");
var react_native_uuid_1 = require("react-native-uuid");
var SettingsScreen = function () {
    var _a = react_1.useContext(MainContext_1.MainContext), mode = _a.mode, setMode = _a.setMode;
    var _b = react_1.useState([]), results = _b[0], setResults = _b[1];
    var _c = react_1.useState(1000), counter = _c[0], setCounter = _c[1];
    console.log('counter:', counter);
    var options = [
        { label: 'Barcode scanning', value: 'barcode_scan' },
        { label: 'Text recognizition', value: 'text_regocnizition' },
        { label: 'Face detection', value: 'face_detection' },
    ];
    // useEffect(() => {
    //   const keys = storage.getAllKeys();
    //   const allValues: any[] = [];
    //   keys.forEach(key => {
    //     const value = storage.getString(key);
    //     if (value) {
    //       const parsedValue = JSON.parse(value);
    //       let totalResultsFound = 0;
    //       parsedValue.results.forEach((result: ResultParameters) => {
    //         totalResultsFound += result.detected_by_frame as unknown as number;
    //       });
    //       parsedValue.totalResults = totalResultsFound;
    //       parsedValue.arithmeticallyFound = parseFloat(
    //         `${totalResultsFound / parsedValue.results.length}`,
    //       ).toFixed(1);
    //       allValues.push(parsedValue);
    //     }
    //   });
    //   setResults(allValues);
    // }, []);
    var testCRUDOperation = function () {
        var jsiTestStartedAt = dayjs_1["default"]();
        // creation
        var jsiItemsCreationsStartedAt = dayjs_1["default"]();
        for (var index = 0; index < counter; index++) {
            storage_1.storage.set("JSI-" + index + "-" + react_native_uuid_1["default"].v4(), "" + react_native_uuid_1["default"].v4());
        }
        var jsiItemsCreationsFinishedAt = dayjs_1["default"]();
        var allKeys = storage_1.storage.getAllKeys();
        console.log('allKeys:', allKeys);
        // read
        var jsiReadingStartedAt = dayjs_1["default"]();
        allKeys.forEach(function (key) {
            storage_1.storage.getString(key);
        });
        var jsiReadingFinishedAt = dayjs_1["default"]();
        // update
        var jsiUpdateStartedAt = dayjs_1["default"]();
        allKeys.forEach(function (key) {
            storage_1.storage.set(key, "" + react_native_uuid_1["default"].v4());
        });
        var jsiUpdateCompletedAt = dayjs_1["default"]();
        // delete
        var jsiDeletionStartedAt = dayjs_1["default"]();
        allKeys.forEach(function (key) {
            storage_1.storage["delete"](key);
        });
        var jsiDeletionFinishedAt = dayjs_1["default"]();
        var jsiTestFinishedAt = dayjs_1["default"]();
        console.log('jsiTestStartedAt:', jsiTestStartedAt);
        console.log('jsiTestFinishedAt', jsiTestFinishedAt);
        // Alert.alert(
        //   'Cache CRUD results',
        //   `${jsiTestFinishedAt.diff(jsiTestStartedAt, 'milliseconds')}`,
        // );
    };
    return (react_1["default"].createElement(react_native_1.View, { style: styles.container },
        react_1["default"].createElement(react_native_picker_select_1["default"], { style: { viewContainer: styles.picker }, items: options, onValueChange: function (val) { return setMode(val); }, value: mode },
            react_1["default"].createElement(react_native_1.Text, null, "Select ML mode")),
        react_1["default"].createElement(react_native_1.View, null,
            react_1["default"].createElement(react_native_1.Text, { style: styles.text }, "CRUD storage test"),
            react_1["default"].createElement(react_native_1.TextInput, { onChangeText: function (e) { return setCounter(parseInt(e, 10)); }, placeholder: "Operation counter", keyboardType: "numeric", defaultValue: counter.toString() }),
            react_1["default"].createElement(react_native_1.Button, { onPress: testCRUDOperation, title: "Start test" })),
        react_1["default"].createElement(react_native_1.ScrollView, null,
            react_1["default"].createElement(react_native_1.Text, { style: styles.text }, "Google MLKit results"))));
};
exports["default"] = SettingsScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: '100%',
        padding: 20
    },
    checkbox: {
        paddingBottom: 20
    },
    checkboxText: {
        color: 'black',
        fontWeight: '600'
    },
    picker: {
        marginTop: 50,
        marginBottom: 20
    },
    resultContainer: {
        marginTop: 30
    },
    labelTextStyle: {
        textDecorationLine: 'none'
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10
    },
    result: {
        paddingBottom: 15
    }
});
