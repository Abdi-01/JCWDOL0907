import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider } from "@chakra-ui/react";
import { Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton } from "@chakra-ui/react";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";
import { fetchOrder } from "../features/orderSlice";

const OrderItem = ({ order_id, order_date, shipping_courier, shipping_type, shipping_price, total_price, payment_proof, order_status }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const [paymetProof, setPaymentProof] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setPaymentProof(file);

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Only JPEG/JPG/PNG files are supported");
      return;
    }

    if (file.size > 1000000) {
      // size limit 1MB
      alert("Maximum size is 1MB");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButton = async () => {
    try {
      const formData = new FormData();
      formData.append("payment_proof", paymetProof);

      let response = await axios.put(`http://localhost:8000/api/order/upload-payment-proof/?orderId=${order_id}`, formData);

      if (response) {
        alert(response.data.message);
        dispatch(fetchOrder(userGlobal.user_id));
        onUploadClose();
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  const handleCancel = async () => {
    // console.log(order_id);
    try {
      const response = await axios.put(`http://localhost:8000/api/order/cancelorder/?orderId=${order_id}`);
      dispatch(fetchOrder(userGlobal.user_id));
      alert(response.data.message);
      onCancelClose();
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to cancel order: ", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex gap-3">
            <Heading size="md" mb="2">
              Order #{order_id}
            </Heading>
            <Text className="text-gray-400 font-bold">{order_status}</Text>
          </div>

          <Text className="text-sm text-gray-400">Order made: {order_date}</Text>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box className="flex justify-between">
              <Heading size="sm">Subtotal</Heading>
              {formatRupiah(total_price - shipping_price)}
            </Box>

            <Box className="flex justify-between">
              <Heading size="sm">Shipping</Heading>
              <div className="text-right">
                {formatRupiah(shipping_price)}
                <div className="text-xs font-bold text-green-500 ">
                  {shipping_courier.toUpperCase()} - {shipping_type}
                </div>
              </div>
            </Box>

            <Box className="flex justify-between font-bold text-lg">
              <Heading size="md">Total</Heading>
              <Text>{formatRupiah(total_price)}</Text>
            </Box>
          </Stack>
        </CardBody>

        <CardFooter className="flex gap-3">
          {order_status === "Waiting for payment" ? (
            <>
              <Button variant="solid" colorScheme="orange" onClick={onUploadOpen}>
                Upload Payment Proof
              </Button>
              <Button variant="ghost" colorScheme="red" onClick={onCancelOpen}>
                Cancel Order
              </Button>
            </>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>

      {/* alert */}
      <AlertDialog isOpen={isCancelOpen} leastDestructiveRef={cancelRef} onClose={onCancelClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel order
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCancelClose}>
                Back
              </Button>
              <Button colorScheme="red" onClick={handleCancel} ml={3}>
                Cancel order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* modal */}
      <Modal closeOnOverlayClick={false} isOpen={isUploadOpen} onClose={onUploadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload payment proof</ModalHeader>

          <ModalBody>
            <div>
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Payment proof
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded" />
                ) : (
                  <div className="text-center">
                    {/* <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" /> */}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">JPEG, JPG, PNG up to 1MB</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={handleUploadButton}>
              Upload
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onUploadClose();
                setPreviewImage(null);
              }}
            >
              Back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrderItem;
