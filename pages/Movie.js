import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid"
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS == 'iso';
const Movie = (style) => {
    const {params: item} = useRoute();
    const [isFavorite, toggleFavorite] = useState(false);
    const [movie, setMovie] = useState({});
    const [movieTitle, setMovieTitle] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        fetchMovies(item);
    }, [item])

    const fetchMovies = async (item) => {
        try {
            const response = await fetch(`http://www.omdbapi.com/?i=${item}&apikey=6fef8cfe`);
            const data = await response.json();
            if (data) {
                setMovie(data);
                setMovieTitle(data.Title);
            }

        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const rottenTomatoesRating = movie.Ratings ? movie.Ratings.find(rating => rating.Source === "Rotten Tomatoes") : null;

    return (
        <ScrollView
            contentContainerStyle={{paddingBottom: 20}}
            className="flex-1 bg-neutral-900"
        >
            <View className="w-full relative">
                <SafeAreaView className={ios? "-md-2 aboslute z-20 w-full px-3" : 'mb-20 aboslute z-20 w-full px-3'}>
                    <View className="flex-row justify-between item-center">
                        <TouchableOpacity className="p-1 mt-2" onPress={() => navigation.goBack()}>
                            <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white mt-5 text-lg">
                            {movieTitle.length>35? movieTitle.slice(0,35)+'...' : movieTitle}
                        </Text>
                        <TouchableOpacity className="p-1 mt-2 mr-1" onPress={() => toggleFavorite(!isFavorite)}>
                            <HeartIcon size={32} color={isFavorite? theme.primary : "white"} />
                        </TouchableOpacity>
                    </View>
                    {movie ? (
                    <View className="w-full mt-10">
                        <Image 
                            src={movie.Poster}
                            className="rounded-xl block"
                            style={{width: width*0.95, height: height*0.80}}
                        />
                        <View className="flex-row justify-between item center my-1">
                            <View>
                                <Text className="text-neutral-300 text-sm">Year: {movie.Year}</Text>
                                {rottenTomatoesRating ? (
                                <Text className="text-neutral-300 text-md">Rating: {rottenTomatoesRating.Value} by: Rotten Tomatoes</Text>
                                ) : (
                                <Text className="text-neutral-300 text-md">Rating: none</Text>
                                )}
                            </View>
                            <Text className="text-neutral-300 text-md">Director: {movie.Director}</Text>
                        </View>
                        <View className="w-100">
                            <Text className="text-white text-xl my-1">Plot</Text>
                            <Text className="text-white text-md">{movie.Plot}</Text>
                        </View>
                    </View>
                    ) : (
                    <Text className="text-white items-center">Not Found</Text>
                    )}
                </SafeAreaView>
            </View>
        </ScrollView>
    )
}

export default Movie;