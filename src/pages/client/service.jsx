import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const ServicePage = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        <Title level={2}>Terms of Service</Title>
        <Paragraph>
          Welcome to our platform. These Terms of Service outline the rules and
          regulations for the use of our website and services. By accessing or
          using our services, you agree to comply with these terms in full.
        </Paragraph>

        <Title level={3}>1. Introduction</Title>
        <Paragraph>
          These Terms of Service govern your use of our website, mobile
          applications, and other related services. Please read them carefully.
          If you do not agree with any part of these terms, you should not use
          our services.
        </Paragraph>

        <Title level={3}>2. Services Provided</Title>
        <Paragraph>
          We provide access to a variety of products and online shopping
          services. We reserve the right to modify, update, or discontinue any
          part of our services without prior notice.
        </Paragraph>

        <Title level={3}>3. User Obligations</Title>
        <Paragraph>
          By using our services, you agree to provide accurate information,
          maintain the confidentiality of your account, and accept
          responsibility for all activities under your account. Misuse of our
          services, including fraudulent activity, is strictly prohibited.
        </Paragraph>

        <Title level={3}>4. Orders and Payments</Title>
        <Paragraph>
          All purchases made through our platform are subject to product
          availability and acceptance of your order. Payment must be made in
          full before products are shipped. We reserve the right to refuse or
          cancel any order at our sole discretion.
        </Paragraph>

        <Title level={3}>5. Returns and Refunds</Title>
        <Paragraph>
          You may return eligible products within 7 days of receipt, provided
          they are unused and in original packaging. Refunds will be processed
          using the same payment method within a reasonable time frame.
        </Paragraph>

        <Title level={3}>6. Termination</Title>
        <Paragraph>
          We may suspend or terminate your account at any time if you violate
          these terms, misuse our services, or engage in unlawful activity.
        </Paragraph>

        <Title level={3}>7. Limitation of Liability</Title>
        <Paragraph>
          We are not liable for any indirect, incidental, or consequential
          damages arising from the use of our services. All services are
          provided “as is” without warranties of any kind.
        </Paragraph>

        <Title level={3}>8. Governing Law</Title>
        <Paragraph>
          These Terms of Service are governed by and construed in accordance
          with the laws of your local jurisdiction. Any disputes will be
          resolved in the courts of that jurisdiction.
        </Paragraph>

        <Title level={3}>9. Changes to Terms</Title>
        <Paragraph>
          We reserve the right to revise these Terms of Service at any time.
          Updates will be effective immediately upon posting. Continued use of
          our services constitutes acceptance of the updated terms.
        </Paragraph>

        <Title level={3}>10. Contact Us</Title>
        <Paragraph>
          If you have any questions about these Terms of Service, please contact
          us at: <strong>support@example.com</strong>.
        </Paragraph>
      </div>
    </div>
  );
};

export default ServicePage;
