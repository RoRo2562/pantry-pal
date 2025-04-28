import { ImageSourcePropType } from "react-native";

export type PantrySliderType = {
    id: number;
  image: ImageSourcePropType;
  title: string;
  description: string;
  color: string;
};

export const PantrySlider = [
    {
        id: 1,
        title: "Pantry",
        image: require("@/assets/images/pantry.png"),
        description: "Store your dry goods and non-perishables in the pantry. Keep your food fresh and organized.",
        color: "#FAEDCD",
    },
    {
        id: 2,
        title: "Fridge",
        image: require("@/assets/images/fridge.png"),
        description: "Keep your perishable items fresh in the fridge. Perfect for dairy, fruits, and vegetables.",
        color: "#C6E2E9",
    },
    {
        id: 3,
        title: "Freezer",
        image: require("@/assets/images/freezer.png"),
        description: "Store your frozen goods in the freezer. Ideal for long-term storage of meats and frozen meals.",
        color: "#A7BED3",
    },
    {
        id: 4,
        title: "Freshbox",
        image: require("@/assets/images/freshbox.png"),
        description: "A special compartment for fresh herbs and delicate items. Keep them fresh and flavorful.",
        color: "#CCD5AE",
    },
]