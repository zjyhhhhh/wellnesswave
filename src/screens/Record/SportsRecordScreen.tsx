import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordStackParamList } from "../../../types";
import { View, Text, SafeAreaView, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { height, width } from "../../constants/Layout";
import Colors from "../../constants/Colors";
import { Feather } from "@expo/vector-icons";
import FoodCategoryPicker from "../../components/FoodCategoryPicker";
import DumbbellOrange from "../../assets/icons/DumbbellOrange.svg";
import { recordStyles as styles } from "./style";
import DatePickerHeader from "../../components/DatePickerHeader";
import { SportsCategories, sportsCategories } from "../../constants/SportsIcons";
import SportsSelectRow from "../../components/SportsSelectRow";
import SportsDurationModal from "../../components/SportsDurationModal";
import SportsDeleteRow from "../../components/SportsDeleteRow";

type Props = NativeStackScreenProps<RecordStackParamList, "SportsRecord">;

const categories = ["Common", "Aerobics", "Ball games", "Strength"];

interface SportsRecord {
	name: string;
	duration: number;
}

const SportsRecordScreen = ({ navigation, route }: Props) => {
	const [category, setCategory] = useState("Common");
	const [selectedItems, setSelectedItems] = useState<SportsRecord[]>([]);
	const [menu, setMenu] = useState(sportsCategories["common"]);
	const [cartShown, setCartShown] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentItem, setCurrentItem] = useState("");

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	useEffect(() => {
		console.log(selectedDate);
	}, [selectedDate]);

	const sendHandler = () => {
		navigation.navigate("Diet");
	};

	useEffect(() => {
		navigation.getParent()?.setOptions({
			tabBarStyle: {
				display: "none",
			},
		});
		return () =>
			navigation.getParent()?.setOptions({
				tabBarStyle: {
					position: "absolute",
					bottom: 0,
					right: 0,
					left: 0,
					elevation: 0,
					height: height * 0.1,
					backgroundColor: Colors.gray,
				},
			});
	}, [navigation]);

	useEffect(() => {
		setMenu(sportsCategories[category.replace(/\s+/g, "").toLowerCase() as keyof SportsCategories]);
	}, [category]);

	return (
		<SafeAreaView style={{ flex: 1, marginBottom: -34 }}>
			<DatePickerHeader
				onDateChange={(date: Date) => {
					setSelectedDate(date);
				}}
			/>
			<View>
				<View style={styles.searchBar}>
					<Feather name="search" size={18} color="black" />
					<TextInput style={{ flex: 1, marginLeft: 0.02 * width }} />
				</View>
			</View>
			<View style={styles.mainContainer}>
				<View style={styles.sidebarContainer}>
					<View style={styles.itemCategoryPickerContainer}>
						{categories.map((cat) => (
							<FoodCategoryPicker
								category={cat}
								currentCategory={category}
								setCategory={setCategory}
								key={cat}
							/>
						))}
					</View>
				</View>
				<ScrollView
					style={{
						height: "100%",
					}}
				>
					<View style={styles.itemContainer}>
						<Text style={styles.itemCategoryTitle}>{category}</Text>
						<View style={{ width: "100%" }}>
							{menu.map((item) => (
								<SportsSelectRow
									key={item}
									iconName={item}
									selected={selectedItems.some((i) => i.name === item) ? true : false}
									addHandler={() => {
										if (selectedItems.some((i) => i.name === item)) {
											const newSelectedItems = selectedItems.filter((i) => i.name !== item);
											setSelectedItems(newSelectedItems);
										} else {
											setModalVisible(true);
											setCurrentItem(item);
										}
									}}
								/>
							))}
						</View>
					</View>
				</ScrollView>
				<SportsDurationModal
					modalVisible={modalVisible}
					setCloseModal={() => setModalVisible(false)}
					currentItem={currentItem}
					addHandler={(duration) => {
						if (selectedItems.some((i) => i.name === currentItem)) {
							const newSelectedItems = selectedItems.map((i) =>
								i.name === currentItem ? { name: currentItem, duration } : i
							);
							setSelectedItems(newSelectedItems);
						} else {
							setSelectedItems([...selectedItems, { name: currentItem, duration }]);
						}
						setModalVisible(false);
					}}
				/>
			</View>
			{cartShown && (
				<View style={styles.cart}>
					<Text style={styles.cartTitle}>{selectedItems.length} records in all</Text>
					<ScrollView>
						<View style={{ width: "100%" }}>
							{selectedItems.map((item) => (
								<SportsDeleteRow
									iconName={item.name}
									key={item.name}
									duration={item.duration}
									editHandler={() => {
										setModalVisible(true);
										setCurrentItem(item.name);
									}}
									deleteHandler={() => {
										const newSelectedItems = selectedItems.filter((i) => i.name !== item.name);
										setSelectedItems(newSelectedItems);
									}}
								/>
							))}
						</View>
					</ScrollView>
				</View>
			)}
			<View style={styles.bottomContainer}>
				<View style={styles.bottom}>
					<View>
						<TouchableOpacity onPress={() => setCartShown(!cartShown)}>
							<DumbbellOrange height={0.15 * width} width={0.15 * width} />
						</TouchableOpacity>
						{selectedItems.length > 0 && (
							<View style={styles.bottomCount}>
								<Text style={styles.bottomCountText}>{selectedItems.length}</Text>
							</View>
						)}
					</View>
					<Text style={styles.bottomTitle}>Sports</Text>
				</View>
				<TouchableOpacity style={styles.bottomButton} onPress={sendHandler}>
					<Text style={styles.bottomButtonText}>OK</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default SportsRecordScreen;
