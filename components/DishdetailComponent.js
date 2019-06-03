import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Button,
  Modal,
  StyleSheet
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite } from "../redux/ActionCreators";

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId))
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style={styles.buttonsRow}>
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log("Already favorite") : props.onPress()
            }
          />
          <Icon
            raised
            reverse
            name="pencil"
            type="font-awesome"
            color="#512DA8"
            onPress={props.handleCommentButton}
          />
        </View>
      </Card>
    );
  } else {
    return <View />;
  }
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

/**
 * Main Component
 */
class Dishdetail extends Component {
  state = {
    showModal: false,
    rating: 1,
    author: "",
    comment: ""
  };
  static navigationOptions = {
    title: "Dish Details"
  };

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  // Method used to toggle the comment modal
  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  handleRating = newRating => {
    this.setState({ rating: newRating });
  };

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          handleCommentButton={this.toggleModal}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={this.toggleModal}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.commentRow}>
            <Rating
              showRating
              ratingCount={5}
              startingValue={this.state.rating}
              onFinishRating={this.handleRating}
            />
          </View>
          <View style={styles.commentRow}>
            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user" }}
              leftIconContainerStyle={{marginRight: 10}}
            />
          </View>
          <View style={styles.commentRow}>
            <Input
              placeholder="Comment"
              leftIcon={{
                type: "font-awesome",
                name: "comment"               
              }}
              leftIconContainerStyle={{marginRight: 10}}
            />
          </View>
          <View style={styles.commentRow}>
            <Button color="#512DA7" title="Submit" onPress={this.toggleModal}  />
          </View>
          <View style={styles.commentRow}>
            <Button onPress={this.toggleModal} color="#808080" title="Cancel"/>
          </View>        
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  buttonsRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row"
  },
  commentRow: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    margin: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dishdetail);
