import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  FileText,
  Users,
  Smartphone,
  Share2,
  Globe,
  Clock,
  Lock,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: "introduction",
      icon: <FileText size={20} className="text-primary" />,
      title: "1. Introduction",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          Servo Fuel Delivery App is committed to protecting the privacy of the
          users of our mobile application and services. This Privacy Policy
          explains what personal data we collect, why we collect it, how we use
          and share it, your rights, and how to contact us. This Policy applies
          to personal data collected when you use the App, visit our website,
          call or email our customer service, or otherwise interact with Servo
          in Nigeria.
          <br />
          <br />
          This Policy is issued in accordance with the Nigeria Data Protection
          Regulation 2019 and the Nigeria Data Protection Act, 2023.
        </p>
      ),
    },
    {
      id: "controller",
      icon: <Shield size={20} className="text-primary" />,
      title: "2. Controller / Contact Details",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          If you have privacy questions, complaints or want to exercise your
          rights, please contact us using the details above. If you remain
          unsatisfied, you may lodge a complaint with the Nigeria Data
          Protection Commission (NDPC) or other competent authorities.
        </p>
      ),
    },
    {
      id: "scope",
      icon: <Users size={20} className="text-primary" />,
      title: "3. Scope & Who This Covers",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">This Policy covers personal data of:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>App users (customers) who request or receive delivery of fuel</li>
            <li>
              Drivers and delivery personnel (including independent contractors)
            </li>
            <li>Visitors to our website</li>
            <li>
              Job applicants and other individuals interacting with Servo in
              Nigeria
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "definitions",
      icon: <FileText size={20} className="text-primary" />,
      title: "4. Definitions",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <div className="mb-2">
            <strong className="text-text-primary dark:text-text-primary-dark">
              Personal Data:
            </strong>{" "}
            Any information relating to an identified or identifiable natural
            person.
          </div>
          <div className="mb-2">
            <strong className="text-text-primary dark:text-text-primary-dark">
              Processing:
            </strong>{" "}
            Any operation performed on personal data (collection, storage, use,
            disclosure, erasure).
          </div>
          <div className="mb-2">
            <strong className="text-text-primary dark:text-text-primary-dark">
              Data Controller:
            </strong>{" "}
            The entity that determines the purpose and means of processing
            personal data (Servo).
          </div>
          <div>
            <strong className="text-text-primary dark:text-text-primary-dark">
              Data Processor:
            </strong>{" "}
            A third party processing data on Servo's behalf (e.g., payment
            processors, analytics providers).
          </div>
        </div>
      ),
    },
    {
      id: "categories",
      icon: <Smartphone size={20} className="text-primary" />,
      title: "5. Categories of Personal Data Collected",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">
            We collect categories of data necessary to provide the Services,
            including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Account & identity data:
              </strong>{" "}
              Full name, email address, phone number, date of birth (if
              required), profile photo (optional).
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Contact & address data:
              </strong>{" "}
              Delivery addresses, billing address, pickup location, emergency
              contact for drivers.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Payment & billing data:
              </strong>{" "}
              Payment instrument details (tokenized card info via third-party
              processors), billing name and address, transaction history. We do
              not store raw card numbers on our servers—payment info is
              processed by PCI-compliant payment processors.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Location & trip data:
              </strong>{" "}
              Real-time and historical GPS coordinates, route, journey start/end
              times for dispatch, live tracking, and route optimization.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Device & usage data:
              </strong>{" "}
              Device identifiers, IP address, OS version, app version, crash
              logs, analytics and logs that help improve the App.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Driver / vehicle data:
              </strong>{" "}
              Driver license details, vehicle registration, photos of vehicle,
              background check information where applicable.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Communications:
              </strong>{" "}
              Call and chat recordings or transcripts (for quality, safety, and
              dispute resolution) if you contact customer support.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Optional / derived data:
              </strong>{" "}
              Ratings & reviews, customer preferences, promotional opt-in
              status.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "legal-bases",
      icon: <Lock size={20} className="text-primary" />,
      title: "6. Legal Bases for Processing",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">
            We process Personal Data where one or more of these lawful bases
            apply:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Consent:
              </strong>{" "}
              When you sign up, opt-in to marketing, or consent to specific
              processing (e.g., share live location with a friend).
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Contract performance:
              </strong>{" "}
              To provide the Services you request (order, delivery, payment,
              dispute resolution).
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Legal obligation:
              </strong>{" "}
              To comply with Nigerian laws and regulatory obligations.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Legitimate interests:
              </strong>{" "}
              For fraud prevention, improving the App, security, or direct
              marketing (balanced against your rights).
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Vital interests / public interest:
              </strong>{" "}
              When necessary for safety in emergencies (e.g., accident
              response).
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "how-we-use",
      icon: <CheckCircle size={20} className="text-primary" />,
      title: "7. How We Use Personal Data (Purposes)",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">We use your data to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Register and manage your account; authenticate you</li>
            <li>
              Provide, operate and maintain the App and Services (order
              acceptance, dispatch, delivery tracking)
            </li>
            <li>
              Process payments and refunds through third-party payment
              processors
            </li>
            <li>
              Communicate important information (booking confirmations,
              receipts, service messages)
            </li>
            <li>
              Improve and personalize the App and user experience (analytics,
              A/B testing)
            </li>
            <li>Prevent fraud and misuse, and ensure platform safety</li>
            <li>
              Handle disputes, claims, investigations and legal requests
            </li>
            <li>
              Send marketing (only where you have opted in or where legitimate
              interest applies and you have not objected)
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "sharing",
      icon: <Share2 size={20} className="text-primary" />,
      title: "8. Sharing & Disclosure of Personal Data",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">We may share personal data with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Delivery partners & drivers:
              </strong>{" "}
              to fulfill deliveries and coordinate pickups.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Service providers / processors:
              </strong>{" "}
              payment processors, cloud hosting, messaging, analytics,
              mapping/GIS providers, background check vendors. Where required,
              such vendors enter into contracts requiring them to protect
              personal data.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Law enforcement and regulators:
              </strong>{" "}
              where compelled by law or to protect rights and safety.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Business transfers:
              </strong>{" "}
              in event of merger, acquisition, insolvency—personal data may be
              part of transferred assets.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-primary-dark">
                Other users:
              </strong>{" "}
              portions of your data (e.g., your name, rating) may be visible to
              drivers or recipients to facilitate delivery.
            </li>
          </ul>
          <p className="mt-2">
            We will not sell your personal data. Any other sharing will be
            subject to safeguards consistent with NDPR/NDPA requirements.
          </p>
        </div>
      ),
    },
    {
      id: "cross-border",
      icon: <Globe size={20} className="text-primary" />,
      title: "9. Cross-Border Transfers",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          If we transfer personal data outside Nigeria (e.g., to cloud providers
          or analytics partners), we will ensure appropriate safeguards are in
          place (standard contractual clauses, contractual protections, or other
          mechanisms required by applicable law) to protect your data in
          accordance with NDPR/NDPA.
        </p>
      ),
    },
    {
      id: "retention",
      icon: <Clock size={20} className="text-primary" />,
      title: "10. Data Retention",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">
            We retain personal data only as long as necessary to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Provide the Services and for legitimate business purposes (e.g.,
              records for billing, disputes)
            </li>
            <li>
              Comply with legal, tax, and regulatory obligations; and
            </li>
            <li>Meet our business purposes described in this Policy.</li>
          </ul>
          <div className="mt-2 p-3 bg-surface-secondary dark:bg-surface-secondary-dark rounded-lg">
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              <strong className="text-text-primary dark:text-text-primary-dark">
                Typical retention examples:
              </strong>
              <br />
              • Transaction records / receipts: minimum 7 years for
              tax/compliance if applicable
              <br />
              • Account data (active users): while account is active + period
              after account closure for disputes and legal obligations
              <br />
              • Location / trip logs: timeframe appropriate for dispute
              resolution — e.g., 12–36 months
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      icon: <Lock size={20} className="text-primary" />,
      title: "11. Security Measures",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">
            We implement reasonable technical and organizational measures to
            protect personal data against unauthorized access, loss, misuse,
            alteration or destruction. Measures include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Encryption in transit (TLS) and encryption at rest where
              appropriate
            </li>
            <li>
              Access controls and role-based access on internal systems
            </li>
            <li>Regular security testing and patching</li>
            <li>Employee training and contractual safeguards with vendors</li>
          </ul>
          <p className="mt-2">
            No system is completely immune to attack; if a data breach occurs
            that creates a real risk to affected persons, we will notify
            affected individuals and the regulator as required by law.
          </p>
        </div>
      ),
    },
    {
      id: "children",
      icon: <Users size={20} className="text-primary" />,
      title: "12. Children & Age Limits",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          Our Services are not targeted at children under 18. We do not
          knowingly collect personal data from minors under 18 without parental
          consent. If we learn that we have collected personal data from a child
          under 18 without verification of parental consent, we will take steps
          to delete that information. The NDPA expanded protections for
          children; we comply with applicable age thresholds.
        </p>
      ),
    },
    {
      id: "cookies",
      icon: <FileText size={20} className="text-primary" />,
      title: "13. Cookies & Tracking Technologies",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          We and our partners use cookies and similar technologies on our
          website and may use mobile identifiers in the App for analytics and
          performance. Cookies may be essential (to provide core functionality)
          or non-essential (analytics/marketing). You may manage cookie
          preferences through your device or browser settings where applicable.
        </p>
      ),
    },
    {
      id: "rights",
      icon: <Shield size={20} className="text-primary" />,
      title: "14. Your Rights",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">
            Under applicable Nigerian data protection law (NDPR/NDPA) you may
            have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Rectify inaccurate or incomplete data</li>
            <li>Erase (right to be forgotten) where retention is no longer justified</li>
            <li>
              Restrict/ object to processing on certain lawful bases
            </li>
            <li>
              Portability of provided personal data in a structured,
              machine-readable format
            </li>
            <li>
              Withdraw consent at any time where processing is based on consent
            </li>
            <li>
              Complain to the Nigeria Data Protection Commission (NDPC) or other
              supervisory authority if you believe your rights have been
              infringed
            </li>
          </ul>
          <p className="mt-2">
            To exercise rights, contact:{" "}
            <a
              href="mailto:24/7@app.servo.sbs"
              className="text-primary hover:text-primary-hover"
            >
              24/7@app.servo.sbs
            </a>{" "}
            We may require verification and will respond within timeframes set
            by applicable law.
          </p>
        </div>
      ),
    },
    {
      id: "opt-out",
      icon: <Mail size={20} className="text-primary" />,
      title: "15. Opt-out / Marketing Preferences",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">
            You can opt out of promotional communications at any time by:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Following the unsubscribe link in our marketing emails</li>
            <li>Updating preferences in the App</li>
            <li>
              Contacting{" "}
              <a
                href="mailto:support@app.servo.sbs"
                className="text-primary hover:text-primary-hover"
              >
                support@app.servo.sbs
              </a>
            </li>
          </ul>
          <p className="mt-2">
            Transactional messages (booking confirmations, payment receipts,
            safety notices) are necessary to provide the Service and cannot be
            opted out of.
          </p>
        </div>
      ),
    },
    {
      id: "requests",
      icon: <FileText size={20} className="text-primary" />,
      title: "16. Data Subject Requests — Procedure",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p>
            To make a request (access, correction, erasure, objection,
            portability), email{" "}
            <a
              href="mailto:Customercare@app.servo.sbs"
              className="text-primary hover:text-primary-hover"
            >
              Customercare@app.servo.sbs
            </a>{" "}
            with:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Your full name, account email/phone</li>
            <li>Description of request</li>
            <li>
              (If applicable) attachments to verify identity
            </li>
          </ul>
          <p className="mt-2">
            We may contact you for more information to verify identity and
            process the request. We will respond within legally required
            timeframes.
          </p>
        </div>
      ),
    },
    {
      id: "third-party",
      icon: <Share2 size={20} className="text-primary" />,
      title: "17. Third-party Links & Embedded Services",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          Our App may contain links to third-party websites or services (e.g.,
          maps, payment gateways). Those services have their own privacy
          policies; we are not responsible for third-party privacy practices. We
          encourage you to read their policies.
        </p>
      ),
    },
    {
      id: "changes",
      icon: <Clock size={20} className="text-primary" />,
      title: "18. Changes to this Policy",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          We may update this Policy from time to time to reflect legal or
          operational changes. We will post the revised Policy in the App and
          website with the updated effective date. Significant changes will be
          communicated where required by law.
        </p>
      ),
    },
    {
      id: "compliance",
      icon: <AlertTriangle size={20} className="text-primary" />,
      title: "19. Lawful Compliance & Enforcement",
      content: (
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          Servo will comply with lawful requests by courts, regulators, or law
          enforcement. We will notify affected users of compelled disclosures
          unless prohibited by law.
        </p>
      ),
    },
    {
      id: "contact",
      icon: <Phone size={20} className="text-primary" />,
      title: "20. Contact Us",
      content: (
        <div className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
          <p className="mb-2">
            For questions, complaints, or requests about your privacy rights,
            please contact:
          </p>
          <div className="p-4 bg-surface-secondary dark:bg-surface-secondary-dark rounded-lg space-y-2">
            <p className="text-text-primary dark:text-text-primary-dark font-medium">
              Servo Fuel Delivery App
            </p>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              Operated by Purple Digital Solution Limited (CAC Registered)
            </p>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              <Phone size={14} className="inline mr-2" />
              <a
                href="tel:+2348113257844"
                className="text-primary hover:text-primary-hover"
              >
                +234 811 325 7844
              </a>
            </p>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              <Mail size={14} className="inline mr-2" />
              <a
                href="mailto:Customercare@app.servo.sbs"
                className="text-primary hover:text-primary-hover"
              >
                Customercare@app.servo.sbs
              </a>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-primary" />
            <h1 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              Privacy Policy
            </h1>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Effective Date */}
        <div className="mb-8 p-4 bg-surface-secondary dark:bg-surface-secondary-dark rounded-xl border border-border dark:border-border-dark">
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm text-center">
            <strong className="text-text-primary dark:text-text-primary-dark">
              Effective Date:
            </strong>{" "}
            January 1, 2024
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 scroll-mt-20"
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  {section.icon}
                </div>
                <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                  {section.title}
                </h2>
              </div>
              <div className="pl-11">{section.content}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-surface-secondary dark:bg-surface-secondary-dark rounded-xl border border-border dark:border-border-dark text-center">
          <p className="text-text-secondary dark:text-text-secondary-dark text-xs">
            © {new Date().getFullYear()} Servo Fuel Delivery App. All rights
            reserved.
          </p>
          <p className="text-text-secondary dark:text-text-secondary-dark text-xs mt-1">
            Operated by Purple Digital Solution Limited
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;