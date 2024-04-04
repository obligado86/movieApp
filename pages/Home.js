import { View, Text, Platform, TouchableOpacity, TouchableWithoutFeedback, Image, Dimensions, ScrollView, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowUpIcon, Bars3CenterLeftIcon, MagnifyingGlassIcon, UserIcon } from 'react-native-heroicons/outline'
import { styles } from '../theme';
import { useNavigation } from "@react-navigation/native";
import * as Progress from 'react-native-progress';

const ios = Platform.OS == 'iso';
const { width, height } = Dimensions.get('window');
const Home = () => {
    const [popular, setPopular] = useState([]);
    const [searchQuery, setSearchQuery] = useState('batman');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);

    useEffect(() => {
        fetchPopularMovies();
    }, [searchQuery]);

    const fetchPopularMovies = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://www.omdbapi.com/?s=${searchQuery}&apikey=6fef8cfe&page=${page}`);
            const data = await response.json();
            if (data && data.Search) {
                setPopular(prevPopular => [...prevPopular, ...data.Search]);
                setPage(page + 1);
            }
        } catch (error) {
            console.error("Error fetching Popular movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        setPage(1);
        setPopular([]);
    };

    const handleLoadMore = () => {
        fetchPopularMovies();
    };

    const handleScrollToTop = () => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
    };

    const handleClick = (item) => {
        navigation.navigate('Movie', item);
    };

    return (
        <View className="flex-1 bg-neutral-800 relative">
            <SafeAreaView className={ios? "-md-2" : 'mb-20'}>
                <StatusBar style="light"/>
                <View className="flex-row justify-between items-center mx-4 py-2">
                    <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white"/>
                    <Text className="text-white text-3xl font-bold">
                        <Text style={styles.text}>M</Text>ovies
                    </Text>
                    <TouchableOpacity>
                        <UserIcon size={25} strokeWidth={2} color="white"/>
                    </TouchableOpacity>
                </View>
                <View className="mb-8 relative">
                    <View className="mx-4 flex-row justify-between items-center py-2">
                        <Text className="text-white text-xl">{searchQuery == "batman" || searchQuery == ""? "Popular" : "Search for " + searchQuery}</Text>
                    </View>

                    <ScrollView 
                        ref={scrollViewRef}
                        vertical
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                    >
                        <View className="px-3 my-2 flex-row justify-between items-center">
                            <TextInput 
                                className="w-[88%] bg-white h-9 rounded-md text-center" 
                                placeholder="Search"
                                value={searchQuery == "batman"? "" : searchQuery}
                                onChangeText={handleSearchChange}
                            />
                            <TouchableOpacity onPress={fetchPopularMovies}>
                                <MagnifyingGlassIcon size={35} strokeWidth={2} color="white"/>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap justify-between px-2 py-2">
                        {
                            popular.map((movie, index) => {
                                return (
                                    <TouchableWithoutFeedback
                                        key={index}
                                        onPress={() => handleClick(movie.imdbID)}
                                    >
                                        <View className={`w-${(width - 40) / 2} mb-4`}>
                                            <Image 
                                                src={movie.Poster}
                                                className="rounded-xl"
                                                style={{width: width*0.46, height: height*0.50}}
                                            />
                                            <Text className="text-neutral-300 ml-1">
                                                {
                                                    movie.Title.length>25? movie.Title.slice(0,25)+'...' : movie.Title
                                                }
                                            </Text>
                                            <Text className="text-neutral-400 ml-1 text-sm">
                                                {movie.Year}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                        </View>
                        {loading ? (
                        <View className="items-center mb-16">
                            <Progress.CircleSnail animating={true} color="white" size={40} />
                        </View>
                        ) : (
                        <View className="items-center mb-16">
                            <TouchableOpacity onPress={handleLoadMore} disabled={loading}>
                                <Text className="text-white px-10 py-2 border border-white">Load More</Text>
                            </TouchableOpacity>
                        </View>
                        )}
                        <View className="absolute bottom-0 right-0 my-20 mx-5">
                            <TouchableOpacity onPress={handleScrollToTop}>
                                <ArrowUpIcon size={25} strokeWidth={2} color="white"/>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default Home;